package com.ssafy.dubdub.recruitment.entity;

import com.ssafy.dubdub.recruitment.entity.enums.GenreType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor
public class Genre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private GenreType genreName;
}
