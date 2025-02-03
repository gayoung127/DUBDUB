package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentGenreId implements Serializable {

    private Long recruitmentId;
    private Long genreId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RecruitmentGenreId that = (RecruitmentGenreId) o;
        return Objects.equals(recruitmentId, that.recruitmentId) && Objects.equals(genreId, that.genreId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(recruitmentId, genreId);
    }
}
