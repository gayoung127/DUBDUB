package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.CategoryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType categoryName;

    @OneToMany(mappedBy = "category")
    private List<RecruitmentCategory> recruitments = new ArrayList<>();
}
