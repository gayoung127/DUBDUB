package com.ssafy.dubdub.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserDTO {
    private String email;
    private String nickname;
    private String profileImage;
}
