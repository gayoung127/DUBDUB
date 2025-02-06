package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.enums.CategoryType;
import com.ssafy.dubdub.enums.GenreType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public record RecruitmentResponseDto(
        @Schema(description = "모집글 제목", example = "보컬 모집합니다!")
        String title,

        @Schema(description = "모집글 설명", example = "우리 팀에서 보컬을 모집합니다.")
        String description,

        @Schema(description = "역할 리스트", example = "[\"보컬\", \"기타\"]")
        List<String> roleList,

        @Schema(description = "장르 리스트", example = "[\"ROCK\", \"POP\"]")
        List<GenreType> genreTypes,

        @Schema(description = "카테고리 리스트", example = "[\"BAND\", \"COVER\"]")
        List<CategoryType> categoryTypes,

        @Schema(description = "스크립트 내용", example = "이 부분은 대본입니다.")
        String script
        ) {
}