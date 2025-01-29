package com.ssafy.dubdub.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDTO {
    private TokenResponseDTO token;
    private boolean isNewMember;
    private Long memberId;
    private String email;
    private String nickname;
}
