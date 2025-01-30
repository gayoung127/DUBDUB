package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class RecruitmentGenre {

    @EmbeddedId
    private RecruitmentGenreId id = new RecruitmentGenreId();

    @ManyToOne
    @MapsId("recruitmentId")
    @JoinColumn(name = "recruitment_id")
    private Recruitment recruitment;

    @ManyToOne
    @MapsId("genreId")
    @JoinColumn(name = "genre_id")
    private Genre genre;
}
