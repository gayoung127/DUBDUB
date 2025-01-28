package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.dto.TokenResponseDTO;

public interface AuthService {
    TokenResponseDTO kakaoLogin(String code);
    TokenResponseDTO refreshToken(String accessToken);
}
