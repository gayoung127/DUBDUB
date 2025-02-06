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

    @Schema(description = "모집글 선택된 장르 조건", example = "[1, 2]")
    private List<Long> genreIds;

    @Schema(description = "모집글 선택된 카테고리 조건", example = "[1, 2]")
    private List<Long> categoryIds;

    @Schema(description = "내가 생성한 / 내가 참여한 프로젝트 조건", example = "CREATED")
    private String participationType;
}


