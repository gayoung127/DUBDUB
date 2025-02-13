package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TrackAssetDto {
    private final int trackId;
    private final Action action;
    private final TrackFile file;
}
