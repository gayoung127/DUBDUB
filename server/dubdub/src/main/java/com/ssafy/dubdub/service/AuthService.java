package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.AuthResponseDTO;
import com.ssafy.dubdub.domain.dto.TokenResponseDTO;
import org.springframework.security.core.Authentication;

public interface AuthService {
    TokenResponseDTO generateToken(Long id, String email);
    Authentication getAuthentication(String token);
    AuthResponseDTO kakaoLogin(String code);
    TokenResponseDTO reissueAccessToken(String accessToken);
}
