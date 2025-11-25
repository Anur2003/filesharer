package p2p.utils;

import java.util.concurrent.ThreadLocalRandom;

public class UploadUtils {

    // Private constructor to prevent instantiation
    private UploadUtils() {
    }

    /**
     * Generates a random 6-character alphanumeric code.
     * This acts as the "share code" (e.g., A7X9P2).
     * 
     * @return A random string code.
     */
    public static String generateCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = ThreadLocalRandom.current().nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }
}
