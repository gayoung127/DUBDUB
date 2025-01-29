package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.dto.AuthResponseDTO;
import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface AuthService {
    TokenResponseDTO generateToken(Long id, String email);
    Authentication getAuthentication(String token);
    AuthResponseDTO kakaoLogin(String code);
    TokenResponseDTO reissueAccessToken(String accessToken);
}
