package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.domain.entity.Recruitment;
import lombok.Getter;

@Getter
public class RecruitmentWithVideoDto {
    private final Recruitment recruitment;
    private final String videoUrl;

    public RecruitmentWithVideoDto(Recruitment recruitment, String videoUrl) {
        this.recruitment = recruitment;
        this.videoUrl = videoUrl;
    }
}
