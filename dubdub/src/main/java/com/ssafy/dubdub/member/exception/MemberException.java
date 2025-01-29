package com.ssafy.dubdub.member.exception;

import com.ssafy.dubdub.config.exception.BaseException;
import com.ssafy.dubdub.config.exception.ErrorCode;

public class MemberException extends BaseException {
    public MemberException(ErrorCode errorCode) {
        super(errorCode);
    }
}
