package com.ssafy.dubdub.util;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.security.dto.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Member getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("현재 인증된 사용자가 없습니다.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails)) {
            throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");
        }

        return ((CustomUserDetails) principal).getMember();
    }
}