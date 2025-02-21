package com.ssafy.dubdub.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FileUploadResponseDTO {
    private final String url;
    private final Long tableId;
}
