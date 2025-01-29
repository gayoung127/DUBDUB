package com.ssafy.dubdub.config.jwt;

import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import com.ssafy.dubdub.auth.exception.AuthException;
import com.ssafy.dubdub.auth.service.RefreshTokenService;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.member.dto.CustomUserDetails;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.repository.MemberRepository;
import com.ssafy.dubdub.member.service.MemberService;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private final RefreshTokenService refreshTokenService;
    private final MemberRepository memberRepository;  // MemberService 대신 Repository 직접 사용
    private final SecretKey secretKey;
    private final Long accessTokenExpiredMs;
    private final Long refreshTokenExpiredMs;

    public JWTUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access.expiration}") Long accessTokenExpiredMs,
            @Value("${jwt.refresh.expiration}") Long refreshTokenExpiredMs,
            RefreshTokenService refreshTokenService,
            MemberRepository memberRepository) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiredMs = accessTokenExpiredMs;
        this.refreshTokenExpiredMs = refreshTokenExpiredMs;
        this.refreshTokenService = refreshTokenService;
        this.memberRepository = memberRepository;
    }

    public TokenResponseDTO generateToken(Long id, String email) {
        String accessToken = createAccessToken(id, email);
        String refreshToken = createRefreshToken(id, email);

        refreshTokenService.saveTokenInfo(email, refreshToken);

        return new TokenResponseDTO(accessToken, refreshToken);
    }

    private String createAccessToken(Long id, String email) {
        Date now = new Date();
        return Jwts.builder()
                .claim("id", id)
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessTokenExpiredMs))
                .signWith(secretKey)
                .compact();
    }

    private String createRefreshToken(Long id, String email) {
        Date now = new Date();
        return Jwts.builder()
                .claim("id", id)
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + refreshTokenExpiredMs))
                .signWith(secretKey)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        String email = getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(ErrorCode.MEMBER_NOT_FOUND));

        CustomUserDetails customUserDetails = new CustomUserDetails(member, false);

        return new UsernamePasswordAuthenticationToken(
                customUserDetails,
                "",
                customUserDetails.getAuthorities()
        );
    }

    public boolean validateToken(String token) {
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

    private String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }

    public void setAuthorizationHeader(HttpServletResponse response, Long memberId, String email) {
        TokenResponseDTO tokenInfo = generateToken(memberId, email);
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenInfo.getAccessToken());
    }
}
