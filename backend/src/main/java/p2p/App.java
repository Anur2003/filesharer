package p2p;

import p2p.controller.FileController;
import java.io.IOException;

public class App {
    public static void main(String[] args) {
        try {
            int port = 8080;
            FileController controller = new FileController(port);
            controller.start();

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down...");
                controller.stop();
            }));

            System.out.println("FileSharer server started on port 8080. Press Ctrl+C to stop.");
            Thread.currentThread().join(); // Keep main thread alive
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
