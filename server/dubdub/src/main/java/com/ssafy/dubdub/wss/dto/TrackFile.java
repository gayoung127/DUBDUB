package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TrackFile {
    private final String id;
    private final String url;
    private final float startPoint;
    private final float duration;
    private final float trimStart;
    private final float trimEnd;
    private final float volume;
}
