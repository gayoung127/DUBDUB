package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.enums.Provider;
import com.ssafy.dubdub.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);
    Optional<Member> findByEmailAndProvider(String email, Provider provider);
    Optional<Member> findByRefreshToken(String refreshToken);
}
