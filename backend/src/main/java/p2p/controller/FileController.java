package p2p.controller;

import p2p.service.FileSharer;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.Executors;

public class FileController {
    private final FileSharer fileSharer;
    private final HttpServer server;
    private final String uploadDir;

    public FileController(int port) throws IOException {
        this.fileSharer = new FileSharer();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        this.server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        this.uploadDir = System.getProperty("java.io.tmpdir") + File.separator + "peerlink-uploads";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        server.createContext("/upload", new UploadHandler());
        server.createContext("/download", new DownloadHandler());
        server.createContext("/", new CORSHandler());
    }

    public void start() {
        server.start();
        System.out.println("API server started on port " + server.getAddress().getPort());
    }

    public void stop() {
        server.stop(0);
        System.out.println("API server stopped");
    }

    private class CORSHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
            } else {
                String response = "Not Found";
                exchange.sendResponseHeaders(404, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    private class UploadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            String contentType = exchange.getRequestHeaders().getFirst("Content-Type");
            if (contentType == null || !contentType.startsWith("multipart/form-data")) {
                sendResponse(exchange, 400, "Content-Type must be multipart/form-data");
                return;
            }

            try {
                String boundary = contentType.substring(contentType.indexOf("boundary=") + 9);
                byte[] requestData = IOUtils.toByteArray(exchange.getRequestBody());

                MultipartParser.ParseResult result = new MultipartParser(requestData, boundary).parse();

                if (result == null) {
                    sendResponse(exchange, 400, "Could not parse file content");
                    return;
                }

                String filename = result.filename() != null && !result.filename().isEmpty()
                        ? result.filename()
                        : "unnamed-file";
                String uniqueFilename = UUID.randomUUID() + "_" + filename;
                String filePath = uploadDir + File.separator + uniqueFilename;

                try (FileOutputStream fos = new FileOutputStream(filePath)) {
                    fos.write(result.fileContent());
                }

                // Generate Share Code instead of Port
                String code = fileSharer.offerFile(filePath);

                String jsonResponse = "{\"code\": \"" + code + "\"}";
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                sendResponse(exchange, 200, jsonResponse);

            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, 500, "Server error: " + e.getMessage());
            }
        }
    }

    private class DownloadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            String path = exchange.getRequestURI().getPath();
            // Extract code from path /download/CODE
            String code = path.substring(path.lastIndexOf('/') + 1);

            String filePath = fileSharer.getFile(code);

            if (filePath == null) {
                sendResponse(exchange, 404, "File not found or code invalid");
                return;
            }

            File file = new File(filePath);
            if (!file.exists()) {
                sendResponse(exchange, 404, "File not found on server");
                return;
            }

            try {
                // Get original filename (remove UUID prefix)
                String originalFilename = file.getName().substring(file.getName().indexOf('_') + 1);

                exchange.getResponseHeaders().add("Content-Disposition",
                        "attachment; filename=\"" + originalFilename + "\"");
                exchange.getResponseHeaders().add("Content-Type", "application/octet-stream");
                exchange.sendResponseHeaders(200, file.length());

                try (OutputStream os = exchange.getResponseBody();
                        FileInputStream fis = new FileInputStream(file)) {
                    fis.transferTo(os);
                }
            } catch (IOException e) {
                e.printStackTrace();
                // Cannot send error response if headers already sent
            }
        }
    }

    private void addCorsHeaders(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.sendResponseHeaders(statusCode, response.length());
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes());
        }
    }

    private record MultipartParser(byte[] data, String boundary) {
        public record ParseResult(String filename, byte[] fileContent) {
        }

        public ParseResult parse() {
            String dataStr = new String(data, StandardCharsets.ISO_8859_1);
            String boundaryMarker = "--" + boundary;

            int startIdx = dataStr.indexOf("filename=\"");
            if (startIdx == -1)
                return null;

            startIdx += 10;
            int endIdx = dataStr.indexOf("\"", startIdx);
            String filename = dataStr.substring(startIdx, endIdx);

            int headerEnd = dataStr.indexOf("\r\n\r\n", endIdx);
            if (headerEnd == -1)
                return null;

            int contentStart = headerEnd + 4;

            byte[] boundaryBytes = ("\r\n" + boundaryMarker).getBytes(StandardCharsets.ISO_8859_1);
            int contentEnd = indexOf(data, boundaryBytes, contentStart);

            if (contentEnd == -1)
                return null;

            byte[] content = new byte[contentEnd - contentStart];
            System.arraycopy(data, contentStart, content, 0, content.length);

            return new ParseResult(filename, content);
        }

        private int indexOf(byte[] array, byte[] target, int start) {
            outer: for (int i = start; i < array.length - target.length + 1; i++) {
                for (int j = 0; j < target.length; j++) {
                    if (array[i + j] != target[j])
                        continue outer;
                }
                return i;
            }
            return -1;
        }
    }
}
