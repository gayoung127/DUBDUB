package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Casting extends Timestamped {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id")
    private Recruitment recruitment;

    @Column(nullable = false)
    private String name;

    public Casting(Recruitment recruitment, String name) {
        this.recruitment = recruitment;
        this.name = name;
    }

    public Casting(String name) {
        this.name = name;
    }

    public void castMember(Long memberId) {
        this.memberId = memberId;
    }
}
