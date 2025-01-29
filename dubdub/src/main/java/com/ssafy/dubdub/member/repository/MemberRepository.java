package com.ssafy.dubdub.member.repository;

import com.ssafy.dubdub.member.entity.Enum.Provider;
import com.ssafy.dubdub.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);
    Optional<Member> findByEmailAndProvider(String email, Provider provider);
    Optional<Member> findByRefreshToken(String refreshToken);
}
