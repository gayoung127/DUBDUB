package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.Position;
import com.ssafy.dubdub.enums.Provider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member extends Timestamped {
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
    private Position position = Position.AMATEUR;

    private String profileUrl;

    @Column(nullable = false)
    private boolean isOk;

    @OneToMany(mappedBy = "author")
    private List<Recruitment> recruitments = new ArrayList<>();

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}