package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TrackFile {
    String id;
    String assetId;
    float startPoint;
    float duration;
    float trimStart;
    float trimEnd;
    float volume;
}
