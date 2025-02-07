package com.ssafy.dubdub.security.jwt;

import com.ssafy.dubdub.service.AuthService;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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

    private final AuthService authService;

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
            String token = getTokenFromCookie(request);

            if (token != null && JWTUtil.validateToken(token)) {
                Authentication authentication = authService.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authentication successful");
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

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
