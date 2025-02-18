package com.ssafy.dubdub.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectListResponseDTO {
    @Schema(description = "프로젝트 id", example = "1")
    private Long id;

    @Schema(description = "프로젝트 썸네일", example = "S3URL")
    private String thumbnailUrl;

    @Schema(description = "모집글 제목", example = "너의 이름은~~")
    private String title;

    public ProjectListResponseDTO(Long id, String title, String thumbnailUrl) {
        this.id = id;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
    }
}
