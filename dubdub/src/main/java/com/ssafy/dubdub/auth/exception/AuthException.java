package com.ssafy.dubdub.auth.exception;

import com.ssafy.dubdub.config.exception.BaseException;
import com.ssafy.dubdub.config.exception.ErrorCode;

public class AuthException extends BaseException {
    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }
}
