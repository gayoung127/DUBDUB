package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.GenreType;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenreType genreName;

    @OneToMany(mappedBy = "genre")
    private List<RecruitmentGenre> recruitments = new ArrayList<>();
}
