package com.ssafy.dubdub.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class RecruitmentListResponseDTO {
    @Schema(description = "모집글 id", example = "1")
    private Long id;

    @Schema(description = "모집글 제목", example = "너의 이름은~~")
    private String title;

    @Schema(description = "시작 시간", example = "1, 2")
    private LocalDateTime startTime;

    @Schema(description = "종료 시간", example = "1, 2")
    private LocalDateTime endTime;

    @Schema(description = "모집글 모집 여부", example = "true")
    private boolean isRecruiting;

    @Schema(description = "모집글의 스튜디오 onAir 여부", example = "true")
    private boolean onAir;

    @Schema(description = "현재 참가자 수", example = "1")
    private int currentParticipants;

    @Schema(description = "필요한 참가자 수", example = "5")
    private int totalParticipants;

    @Schema(description = "모집글 선택된 장르들", example = "1, 2")
    private List<Long> genres;

    @Schema(description = "모집글 선택된 카테고리들", example = "1, 2")
    private List<Long> categories;
}
