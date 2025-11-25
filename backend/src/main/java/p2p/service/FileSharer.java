package p2p.service;

import p2p.utils.UploadUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FileSharer {

    private final Map<String, String> availableFiles;

    public FileSharer() {
        this.availableFiles = new ConcurrentHashMap<>();
    }

    public String offerFile(String filePath) {
        String code;
        // Generate a unique code
        do {
            code = UploadUtils.generateCode();
        } while (availableFiles.containsKey(code));

        availableFiles.put(code, filePath);
        return code;
    }

    public String getFile(String code) {
        return availableFiles.get(code);
    }
}
