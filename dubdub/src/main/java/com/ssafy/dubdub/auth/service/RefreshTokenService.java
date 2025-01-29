package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    void saveTokenInfo(String email, String refreshToken);
    void removeRefreshToken(String email);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
