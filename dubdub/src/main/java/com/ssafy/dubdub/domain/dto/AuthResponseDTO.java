package com.ssafy.dubdub.domain.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDTO {
    private TokenResponseDTO token;
    private boolean isNewMember;
    private Long memberId;
}
