package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CursorData {
    private final String memberId; //dubdub memebr Id
    private final String openviduId; // 참여자 식별자
    private final double x;  // 마우스 X 좌표
    private final double y;  // 마우스 Y 좌표
    private final String name; // 사용자 이름
    private final boolean selecting; // 블록 선택 여부
    private final String selectedAudioBlockId; // 선택한 오디오 블록 ID (null 허용)
}

