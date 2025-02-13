package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AudioAssetRequestDto {
    private final Action action;
    private final AudioAsset audioAsset;
}
