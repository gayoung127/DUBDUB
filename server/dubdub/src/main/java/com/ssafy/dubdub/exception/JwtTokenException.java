package com.ssafy.dubdub.exception;

public class JwtTokenException extends BaseException {
    public JwtTokenException(ErrorCode errorCode) {
        super(errorCode);
    }
}
