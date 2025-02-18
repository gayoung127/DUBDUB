package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.enums.ParticipationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class ProjectSearchRequestDTO {
    @Schema(description = "페이지 번호", example = "0")
    private Integer page;

    @Schema(description = "한 페이지에 들어갈 갯수", example = "10")
    private Integer size;

    @Schema(description = "내가 생성한 / 내가 참여한 프로젝트 조건", example = "CREATED")
    private ParticipationType participationType;
}


