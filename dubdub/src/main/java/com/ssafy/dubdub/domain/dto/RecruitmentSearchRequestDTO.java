package com.ssafy.dubdub.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class RecruitmentSearchRequestDTO {
    @Schema(description = "페이지 번호", example = "0")
    private Integer page;

    @Schema(description = "한 페이지에 들어갈 갯수", example = "10")
    private Integer size;

    @Schema(description = "모집글 타이틀 검색어", example = "쵸파")
    private String searchKeyword;

    @Schema(description = "스튜디오 생성된 / 정해진 시간인 onAir 모집글 조건", example = "true")
    private Boolean onAir;

    @Schema(description = "비공개 여부 조건", example = "true")
    private Boolean isPrivate;

    @Schema(description = "모집글 선택된 장르 조건", example = "[1, 2]")
    private List<Long> genreIds;

    @Schema(description = "모집글 선택된 카테고리 조건", example = "[1, 2]")
    private List<Long> categoryIds;

    @Schema(description = "모집글 모집중인 조건", example = "true")
    private Boolean isRecruiting;

    @Schema(description = "전체 조회 / 내가 참여한 모집글 조건", example = "MY")
    private String participationType;
}


