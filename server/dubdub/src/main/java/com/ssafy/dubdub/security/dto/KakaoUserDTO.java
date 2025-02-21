package com.ssafy.dubdub.security.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserDTO {
    private String email;
    private String nickname;
    private String profileImage;
}
