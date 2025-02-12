package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TrackAssetDto {
    int trackId;
    Action action;
    TrackFile file;
}
