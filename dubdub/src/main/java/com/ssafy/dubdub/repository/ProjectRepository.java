package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByIdAndOwnerId(Long id, Long OwnerId);
}
