package com.ssafy.dubdub.domain.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ssafy.dubdub.util.JsonStringDeserializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Getter
public class ProjectCreateRequestDTO {
    @Schema(description = "프로젝트 제목", example = "짱구는 못말려 7기 3화 더빙하실 분")
    private String title;

    @Schema(description = "역할 리스트", example = "[\"짱구\", \"철수\"]")
    private List<String> castings;

    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    @Schema(description = "스크립트 내용", example = "이 부분은 대본입니다.")
    private String script;
}