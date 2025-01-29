package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.dto.AuthResponseDTO;
import com.ssafy.dubdub.auth.dto.TokenResponseDTO;

public interface AuthService {
    AuthResponseDTO kakaoLogin(String code);
    TokenResponseDTO refreshToken(String accessToken);
}
