package com.ssafy.dubdub.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
@Getter
public class StudioEnterResponseDto {
    private final String title;
    private final String script;
    private final String session;
    private final String token;
    private final ProjectSnapShot snapShot;
    private final String workspaceData;
}
