package com.ssafy.dubdub.config.jwt;

import com.ssafy.dubdub.config.exception.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.stream.Stream;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return Stream.of(
                "/", "/swagger-ui/**", "/auth/**", "/v3/api-docs/**").anyMatch(pattern ->
                new AntPathMatcher().match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getTokenFromHeader(request);

            if (token != null && jwtUtil.validateToken(token)) {
                Authentication authentication = jwtUtil.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException e) {
            log.error("Token expired: {}", e.getMessage());
            request.setAttribute("exception",
                    ErrorCode.JWT_TOKEN_EXPIRED_EXCEPTION);
        } catch (JwtException e) {
            log.error("Invalid token: {}", e.getMessage());
            request.setAttribute("exception",
                    ErrorCode.JWT_TOKEN_INVALID_EXCEPTION);
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage());
            request.setAttribute("exception",
                    ErrorCode.JWT_TOKEN_PROCESSING_ERROR);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
