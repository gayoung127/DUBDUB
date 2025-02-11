package com.ssafy.dubdub.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AuthException.class)
    protected ResponseEntity<ErrorResponse> handleAuthException(AuthException e) {
        log.error("인가/인증에서의 예외 발생: {}", e.getMessage());
        return ErrorResponse.toResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(JwtTokenException.class)
    protected ResponseEntity<ErrorResponse> handleJwtTokenException(JwtTokenException e) {
        log.error("JWT토큰에서 예외 발생: {}", e.getMessage());
        return ErrorResponse.toResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(MemberException.class)
    protected ResponseEntity<ErrorResponse> handleMemberException(MemberException e) {
        log.error("멤버 예외 발생: {}", e.getMessage());
        return ErrorResponse.toResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(RecruitmentException.class)
    protected ResponseEntity<ErrorResponse> handleRecruitmentException(RecruitmentException e) {
        log.error("프로젝트(모집글) 예외 발생: {}", e.getMessage());
        return ErrorResponse.toResponseEntity(e.getErrorCode());
    }


    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("HandleException: {}", e.getMessage());
        return ResponseEntity
                .status(500)
                .body(
                        ErrorResponse.builder()
                                .status(500)
                                .message(e.getMessage() != null ? e.getMessage() : "서버 내부오류입니다.")
                                .build()
                );
    }
}
