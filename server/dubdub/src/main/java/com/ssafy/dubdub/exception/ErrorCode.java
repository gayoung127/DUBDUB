package com.ssafy.dubdub.exception;

import lombok.Getter;
import org.hibernate.validator.internal.constraintvalidators.hv.ru.INNValidator;

@Getter
public enum ErrorCode {
    JWT_TOKEN_EXPIRED_EXCEPTION(401, "토큰이 만료되었습니다."),
    JWT_TOKEN_INVALID_EXCEPTION(401, "유효하지 않은 토큰입니다."),
    JWT_TOKEN_PROCESSING_ERROR(500, "토큰 처리 중 오류가 발생했습니다."),
    JWT_TOKEN_NOT_FOUND_EXCEPTION(401, "토큰이 존재하지 않습니다."),

    KAKAO_AUTH_CODE_ALREADY_USED(400, "이미 사용된 인가 코드입니다. 새로운 인가 코드를 발급받아 시도해주세요."),
    OAUTH_REGISTRATION_NOT_FOUND(404, "등록되지 않은 OAuth 제공자입니다."),
    KAKAO_TOKEN_ERROR(500, "카카오 토큰 처리 중 오류가 발생했습니다."),
    KAKAO_USER_INFO_ERROR(500, "카카오 사용자 정보 조회 중 오류가 발생했습니다."),

    MEMBER_NOT_FOUND(404, "존재하지 않는 회원입니다."),
    REFRESH_TOKEN_NOT_FOUND(404, "리프레시 토큰을 찾을 수 없습니다."),
    REFRESH_TOKEN_EXPIRED(401, "리프레시 토큰이 만료되었습니다."),
    TOKEN_NOT_FOUND(401, "토큰이 존재하지 않습니다."),

    INVALID_IMAGE_FORMAT(400, "지원하지 않는 이미지 형식입니다."),
    INVALID_AUDIO_FORMAT(400, "지원하지 않는 오디오 형식입니다."),
    INVALID_VIDEO_FORMAT(400, "지원하지 않는 비디오 형식입니다."),

    FILE_UPLOAD_FAILED(500, "파일 업로드 중 오류가 발생했습니다."),

    UNAUTHORIZED_ACCESS(403, "접근 권한이 없습니다."),

    CASTING_NOT_FOUND(404, "요청하신 역할을 찾을 수 없습니다."),
    CASTING_ALREADY_ASSIGNED(400, "이미 배정된 역할입니다.");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
