package com.ssafy.dubdub.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private static String secret;
    private static Long accessTokenExpiredMs;
    private static Long refreshTokenExpiredMs;
    private static SecretKey secretKey;

    @Value("${jwt.secret}")
    public void setSecret(String secret) {
        JWTUtil.secret = secret;
    }

    @Value("${jwt.access.expiration}")
    public void setAccessTokenExpiredMs(Long accessTokenExpiredMs) {
        JWTUtil.accessTokenExpiredMs = accessTokenExpiredMs;
    }

    @Value("${jwt.refresh.expiration}")
    public void setRefreshTokenExpiredMs(Long refreshTokenExpiredMs) {
        JWTUtil.refreshTokenExpiredMs = refreshTokenExpiredMs;
    }

    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public static String createAccessToken(Long id, String email) {
        return createToken(id, email, accessTokenExpiredMs);
    }

    public static String createRefreshToken(Long id, String email) {
        return createToken(id, email, refreshTokenExpiredMs);
    }

    private static String createToken(Long id, String email, Long expireTime) {
        Date now = new Date();
        return Jwts.builder()
                .claim("id", id)
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expireTime))
                .signWith(secretKey)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }

    public static String extractToken(String bearerToken) {
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public static String createBearerToken(String token) {
        return "Bearer " + token;
    }

    public static void setBearerToken(HttpServletResponse response, String token) {
        response.setHeader(HttpHeaders.AUTHORIZATION, createBearerToken(token));
    }
}
