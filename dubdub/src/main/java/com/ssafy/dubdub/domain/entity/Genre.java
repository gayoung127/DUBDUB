package com.ssafy.dubdub.domain.entity;

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

    private String genreName;

    @OneToMany(mappedBy = "genre")
    private List<RecruitmentGenre> recruitments = new ArrayList<>();
}
