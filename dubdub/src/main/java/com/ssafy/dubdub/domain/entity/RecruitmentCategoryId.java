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
public class RecruitmentCategoryId implements Serializable {

    private Long recruitmentId;
    private Long categoryId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RecruitmentCategoryId that = (RecruitmentCategoryId) o;
        return Objects.equals(recruitmentId, that.recruitmentId) && Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(recruitmentId, categoryId);
    }
}