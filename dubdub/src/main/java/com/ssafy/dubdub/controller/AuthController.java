package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.AuthResponseDTO;
import com.ssafy.dubdub.domain.dto.TokenResponseDTO;
import com.ssafy.dubdub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    @Value("${jwt.access.expiration}")
    private int accessTokenExpiredMs;
    @Value("${jwt.refresh.expiration}")
    private int refreshTokenExpiredMs;
    @Value("${spring.application.frontend-url}")
    private String frontendBaseUrl;


    @Operation(summary = "CORS Preflight 요청 처리")
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> preflightRequest() {
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "카카오 소셜 로그인 통신")
    @GetMapping("/login")
    public void kakaoLogin(@RequestParam String code, HttpServletResponse response) throws IOException{
        try {
            AuthResponseDTO authResponse = authService.kakaoLogin(code);

            response.addCookie(createAccessTokenCookie(authResponse.getToken().getAccessToken()));
            response.addCookie(createRefreshTokenCookie(authResponse.getToken().getRefreshToken()));

            String redirectUrl = UriComponentsBuilder
                    .fromUriString(frontendBaseUrl)
                    .queryParam("isLogin", "true")
                    .build()
                    .toUriString();

            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            log.error("카카오 로그인 실패: ", e);

            String redirectUrl = UriComponentsBuilder
                    .fromUriString(frontendBaseUrl)
                    .queryParam("isLogin", "false")
                    .queryParam("error", "소셜 로그인에 실패했습니다")
                    .build()
                    .toUriString();

            response.sendRedirect(redirectUrl);
        }
    }


    @Operation(summary = "token 재발급")
    @PostMapping("/token")
    public ResponseEntity<Void> reissueTokens(
            @CookieValue("refreshToken") String refreshToken,
            HttpServletResponse response) {
        TokenResponseDTO tokenResponse = authService.reissueAccessToken(refreshToken);

        response.addCookie(createAccessTokenCookie(tokenResponse.getAccessToken()));
        response.addCookie(createRefreshTokenCookie(tokenResponse.getRefreshToken()));

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "토큰 유효성 검증")
    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(
            @CookieValue("accessToken") String accessToken) {
        return ResponseEntity.ok().build();
    }

    private Cookie createSecureCookie(String name, String value, String path, int maxAge) {
        Cookie cookie = new Cookie(name, value);

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setAttribute("SameSite", "None");
//        cookie.setDomain("i12a801.p.ssafy.io");
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);

        return cookie;
    }

    private Cookie createAccessTokenCookie(String token) {
        return createSecureCookie(
                "accessToken",
                token,
                "/",
                accessTokenExpiredMs / 1000
        );
    }

    private Cookie createRefreshTokenCookie(String token) {
        return createSecureCookie(
                "refreshToken",
                token,
                "/auth/token",
                refreshTokenExpiredMs / 1000
        );
    }
}
