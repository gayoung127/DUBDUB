package com.ssafy.dubdub.member.service;

import com.ssafy.dubdub.auth.dto.KakaoUserDTO;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.exception.MemberException;
import com.ssafy.dubdub.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;

    public Member findByEmail(String email){
        return memberRepository.findByEmail(email).orElseThrow(() -> new MemberException(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Override
    @Transactional
    public Member findByEmailOrRegister(KakaoUserDTO kakaoUser) {
        return memberRepository.findByEmail(kakaoUser.getEmail())
                .orElseGet(() -> memberRepository.save(
                        Member.builder()
                                .provider("KAKAO")
                                .email(kakaoUser.getEmail())
                                .nickname(kakaoUser.getNickname())
                                .profileUrl(kakaoUser.getProfileImage())
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Member> findByRefreshToken(String refreshToken) {
        return memberRepository.findByRefreshToken(refreshToken);
    }

    @Override
    @Transactional
    public void updateRefreshToken(String email, String refreshToken) {
        Member member = findByEmail(email);
        member.updateRefreshToken(refreshToken);
    }
}
