package com.ssafy.dubdub.domain.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class StudioEnterResponseDto {
    private final String title;
    private final String script;
    private final List<String> roleList;
    private final String videoUrl;
    private final String thumbnailUrl;
    private final String session;
    private final String token;
    private final SnapshotDTO snapshot;
}
