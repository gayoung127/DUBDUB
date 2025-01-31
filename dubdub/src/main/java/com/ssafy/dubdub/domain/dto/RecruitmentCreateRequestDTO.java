package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.enums.CategoryType;
import com.ssafy.dubdub.enums.GenreType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class RecruitmentCreateRequestDTO {
    @Schema(description = "모집글 제목", example = "짱구는 못말려 7기 3화 더빙하실 분")
    private String title;

    @Schema(description = "모집글 설명", example = "ㅈㄱㄴ")
    private String content;

    @Schema(description = "비공개 여부", example = "false")
    private boolean isPrivate;

    @Schema(description = "시작 시간", example = "2025-02-01T12:00:00")
    private LocalDateTime startTime;

    @Schema(description = "종료 시간", example = "2025-02-10T18:00:00")
    private LocalDateTime endTime;

    @Schema(description = "역할 리스트", example = "[\"짱구\", \"철수\"]")
    private List<String> castings;

    @Schema(description = "장르 리스트", example = "[\"액션\", \"코미디\", \"스릴러\", \"로맨스\", \"SF\", \"판타지\", \"일상\", \"기타\"]")
    private List<GenreType> genreTypes;

    @Schema(description = "카테고리 리스트", example = "[\"영화\", \"드라마\", \"다큐멘터리\", \"애니메이션\", \"광고\", \"기타\"]")
    private List<CategoryType> categoryTypes;

    @Schema(description = "스크립트 내용", example = "이 부분은 대본입니다.")
    private String script;
}