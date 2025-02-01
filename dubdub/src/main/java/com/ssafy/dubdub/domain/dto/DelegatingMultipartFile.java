package com.ssafy.dubdub.domain.dto;

import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class DelegatingMultipartFile implements MultipartFile {
    private final InputStream inputStream;
    private final String filename;
    private final String contentType;
    private byte[] cachedBytes;

    public DelegatingMultipartFile(InputStream inputStream, String filename, String contentType) {
        if (inputStream == null) {
            throw new IllegalArgumentException("파일 데이터 스트림이 존재 하지 않습니다.");
        }
        this.inputStream = inputStream;
        this.filename = filename;
        this.contentType = contentType;
    }

    @Override
    public String getName() {
        return filename;
    }

    @Override
    public String getOriginalFilename() {
        return filename;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        try {
            return inputStream.available() == 0;
        } catch (IOException e) {
            return true;
        }
    }

    @Override
    public long getSize() {
        try {
            if (cachedBytes != null) {
                return cachedBytes.length;
            }
            return inputStream.available();
        } catch (IOException e) {
            return 0;
        }
    }

    @Override
    public byte[] getBytes() throws IOException {
        if (cachedBytes == null) {
            try {
                cachedBytes = inputStream.readAllBytes();
            } catch (IOException e) {
                throw new IOException("데이터를 읽을 수 없습니다.", e);
            }
        }
        return cachedBytes;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        if (cachedBytes != null) {
            return new ByteArrayInputStream(cachedBytes);
        }
        return inputStream;
    }


    @Override
    public void transferTo(File dest) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(getBytes());
        } catch (IOException e) {
            throw new IOException("Failed to transfer file to destination", e);
        }
    }

    public void cleanupResources() {
        try {
            inputStream.close();
        } catch (IOException e) {
        }
    }
}
