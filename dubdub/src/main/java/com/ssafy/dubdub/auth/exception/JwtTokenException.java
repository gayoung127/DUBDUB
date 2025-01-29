package com.ssafy.dubdub.auth.exception;

import com.ssafy.dubdub.config.exception.BaseException;
import com.ssafy.dubdub.config.exception.ErrorCode;

public class JwtTokenException extends BaseException {
    public JwtTokenException(ErrorCode errorCode) {
        super(errorCode);
    }
}
