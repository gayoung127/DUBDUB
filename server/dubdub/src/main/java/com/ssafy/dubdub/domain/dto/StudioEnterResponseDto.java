package com.ssafy.dubdub.domain.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ssafy.dubdub.util.JsonStringDeserializer;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class StudioEnterResponseDto {
    private final String title;

    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    private final String script;

    private final List<String> roleList;

    private final String videoUrl;

    private final String thumbnailUrl;

    private final String session;

    private final String token;

    private final SnapshotDTO snapshot;
}
