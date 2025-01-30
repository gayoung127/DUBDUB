package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class RecruitmentCategory {

    @EmbeddedId
    private RecruitmentCategoryId id = new RecruitmentCategoryId();

    @ManyToOne
    @MapsId("recruitmentId")
    @JoinColumn(name = "recruitment_id")
    private Recruitment recruitment;

    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    public RecruitmentCategory(Recruitment recruitment, Category category) {
        this.recruitment = recruitment;
        this.category = category;
    }
}

