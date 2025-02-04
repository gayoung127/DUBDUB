package com.ssafy.dubdub.domain.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class RecruitmentListResponseDTO {
    private Long id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isRecruiting;
    private boolean onAir;
    private int currentParticipants;
    private int totalParticipants;
    private Long authorId;
    private List<Long> genres;
    private List<Long> categories;
}
