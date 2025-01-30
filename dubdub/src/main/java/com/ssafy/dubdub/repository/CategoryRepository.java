package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Category;
import com.ssafy.dubdub.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryName(CategoryType categoryName);
}

