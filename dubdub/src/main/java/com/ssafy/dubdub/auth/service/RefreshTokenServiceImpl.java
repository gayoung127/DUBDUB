package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.entity.RefreshToken;
import com.ssafy.dubdub.auth.exception.AuthException;
import com.ssafy.dubdub.auth.repository.RefreshTokenRepository;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public void saveTokenInfo(String email, String refreshToken) {
        repository.save(new RefreshToken(email, refreshToken));

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(ErrorCode.MEMBER_NOT_FOUND));
        member.updateRefreshToken(refreshToken);
    }

    @Override
    @Transactional
    public void removeRefreshToken(String email) {
        repository.deleteById(email);

        memberRepository.findByEmail(email)
                .ifPresent(member -> member.updateRefreshToken(null));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByRefreshToken(String refreshToken) {
        Optional<RefreshToken> redisToken = repository.findByRefreshToken(refreshToken);

        if (redisToken.isEmpty()) {
            log.info("Token not found in Redis, attempting to recover from Member entity");
            return memberRepository.findByRefreshToken(refreshToken)
                    .map(member -> new RefreshToken(
                            member.getEmail(),
                            member.getRefreshToken()
                    ));
        }

        return redisToken;
    }

}
