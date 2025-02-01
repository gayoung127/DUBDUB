package com.ssafy.dubdub.util;

import com.ssafy.dubdub.enums.FileType;
import jakarta.activation.MimetypesFileTypeMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class FileUtil {

    private static final List<String> ALLOWED_IMAGE_MIME_TYPES = Arrays.asList(
            "image/jpeg",   // JPEG
            "image/png"     // PNG
    );

    private static final List<String> ALLOWED_VIDEO_MIME_TYPES = Arrays.asList(
            "video/mp4",        // MP4
            "video/webm",       // WebM
            "video/x-msvideo",  // AVI
            "video/quicktime"   //.mov
    );

    private static final MimetypesFileTypeMap FILE_TYPE_MAP = new MimetypesFileTypeMap();

    public static boolean isValidImageFile(MultipartFile file) {
        return isValidFile(file, ALLOWED_IMAGE_MIME_TYPES);
    }

    public static boolean isValidVideoFile(MultipartFile file) {
        return isValidFile(file, ALLOWED_VIDEO_MIME_TYPES);
    }

    private static boolean isValidFile(MultipartFile file, List<String> mimeTypes) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String mimeType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        if (mimeType == null || originalFilename == null) {
            return false;
        }

        if (!mimeTypes.contains(mimeType)) {
            return false;
        }

        return true;
    }

    private static boolean isMimeTypeMatchesExtension(String mimeType, String originalFilename) {
        // 확장자 기반 MIME 타입 추론
        String expectedMimeType = FILE_TYPE_MAP.getContentType(originalFilename);

        return mimeType.equals(expectedMimeType);
    }

    public static String generateUniqueFileName(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }

    public static String generateFilePath(String email, FileType fileType) {
        return email +"/"+ fileType.name() + "/";
    }
}