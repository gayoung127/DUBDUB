package com.ssafy.dubdub.auth.controller;

import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import com.ssafy.dubdub.auth.service.AuthService;
import com.ssafy.dubdub.auth.service.RefreshTokenService;
import com.ssafy.dubdub.member.service.MemberService;
import com.ssafy.dubdub.config.jwt.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "카카오 소셜 로그인 통신")
    @GetMapping("/login")
    public ResponseEntity<TokenResponseDTO> kakaoLogin(
            @RequestParam("code") String code) {
        return ResponseEntity.ok(authService.kakaoLogin(code));
    }

    @Operation(summary = "access token 재발급")
    @PostMapping("/token")
    public ResponseEntity<TokenResponseDTO> refreshToken(
            @RequestHeader("Authorization") String bearerToken) {
        String accessToken = bearerToken.substring(7);
        return ResponseEntity.ok(authService.refreshToken(accessToken));
    }
}
