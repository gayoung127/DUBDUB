package com.ssafy.dubdub.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import software.amazon.awssdk.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public class CreationResponseDto {
    private final Long id;
    private final int statusCode;
}
