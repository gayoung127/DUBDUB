package com.ssafy.dubdub.wss.dto;

import lombok.Getter;

@Getter
public class CursorData {
    private String id; // 참여자 식별자
    private double x;  // 마우스 X 좌표
    private double y;  // 마우스 Y 좌표
    private String name; // 사용자 이름
    private boolean isSelecting; // 블록 선택 여부
    private String selectedAudioBlockId; // 선택한 오디오 블록 ID (null 허용)
}

