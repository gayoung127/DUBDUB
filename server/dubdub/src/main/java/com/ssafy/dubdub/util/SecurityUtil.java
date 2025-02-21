package com.ssafy.dubdub.util;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.exception.AuthException;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.security.dto.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Member getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails)) {
            throw new AuthException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        return ((CustomUserDetails) principal).getMember();
    }
}