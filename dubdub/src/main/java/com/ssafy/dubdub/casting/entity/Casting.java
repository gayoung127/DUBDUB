package com.ssafy.dubdub.casting.entity;

import com.ssafy.dubdub.recruitment.entity.Recruitment;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.repository.MemberRepository;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Casting {
    @Id
    private Long id;  // 기본키

    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id", insertable = false, updatable = false)
    private Recruitment recruitment;

    @Column(nullable = false)
    private String name;

    private LocalDateTime updatedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    Member findMember(MemberRepository memberRepository) {
        if (this.memberId == null) {
            return null;
        }
        return memberRepository.findById(this.memberId).orElse(null);
    }
}
