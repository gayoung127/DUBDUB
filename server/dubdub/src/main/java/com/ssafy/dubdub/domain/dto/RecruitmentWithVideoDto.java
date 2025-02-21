package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.domain.entity.Project;
import lombok.Getter;

@Getter
public class RecruitmentWithVideoDto {
    private final Project project;
    private final String videoUrl;

    public RecruitmentWithVideoDto(Project project, String videoUrl) {
        this.project = project;
        this.videoUrl = videoUrl;
    }
}
