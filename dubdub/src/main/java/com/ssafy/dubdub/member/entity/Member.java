package com.ssafy.dubdub.member.entity;

import com.ssafy.dubdub.member.entity.Enum.Position;
import com.ssafy.dubdub.member.entity.Enum.Provider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String nickname;

    private String refreshToken;

    @Enumerated(EnumType.STRING)
    private Position position;

    private String profileUrl;

    @Column(nullable = false)
    private boolean isOk;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

//    @OneToMany(mappedBy = "member")
//    private List<Recruitment> recruitments = new ArrayList<>();

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        this.updatedAt = LocalDateTime.now();
    }
}