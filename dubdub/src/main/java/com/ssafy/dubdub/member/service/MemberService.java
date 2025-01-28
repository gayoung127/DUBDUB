package com.ssafy.dubdub.member.service;

import com.ssafy.dubdub.auth.dto.KakaoUserDTO;
import com.ssafy.dubdub.member.entity.Member;

import java.util.Optional;

public interface MemberService {
    Member findByEmail(String email);
    Member findByEmailOrRegister(KakaoUserDTO kakaoUser);
    Optional<Member> findByRefreshToken(String refreshToken);
    void updateRefreshToken(String email, String refreshToken);
}
