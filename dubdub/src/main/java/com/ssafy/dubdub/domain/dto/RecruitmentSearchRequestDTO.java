package com.ssafy.dubdub.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class RecruitmentSearchRequestDTO {
    @Schema(description = "페이지 번호")
    private Integer page;
    private Integer size;
    private Boolean onAir;
    private Boolean isPrivate;
    private List<Long> genreIds;
    private List<Long> categoryIds;
    private Boolean isRecruiting;
    private String participationType;
}


