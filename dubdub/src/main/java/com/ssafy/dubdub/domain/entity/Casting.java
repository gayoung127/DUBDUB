package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.repository.MemberRepository;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Casting extends Timestamped {
    @Id
    private Long id;  // 기본키

    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id", insertable = false, updatable = false)
    private Recruitment recruitment;

    @Column(nullable = false)
    private String name;


    Member findMember(MemberRepository memberRepository) {
        if (this.memberId == null) {
            return null;
        }
        return memberRepository.findById(this.memberId).orElse(null);
    }
}
