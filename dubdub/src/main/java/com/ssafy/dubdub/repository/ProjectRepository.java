package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.dto.ProjectListResponseDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT new com.ssafy.dubdub.domain.dto.ProjectListResponseDTO(" +
            "p.id, " +
            "p.title, " +
            "(SELECT f.url FROM File f WHERE f.project = p AND f.fileType = 'THUMBNAIL' AND f.isDeleted = false)) " +
            "FROM Project p WHERE p.owner = :owner")
    Page<ProjectListResponseDTO> findProjectsWithThumbnailByOwner(@Param("owner") Member owner, Pageable pageable);

    @Query("SELECT new com.ssafy.dubdub.domain.dto.ProjectListResponseDTO(" +
            "p.id, " +
            "p.title, " +
            "(SELECT f.url FROM File f WHERE f.project = p AND f.fileType = 'THUMBNAIL' AND f.isDeleted = false)) " +
            "FROM Project p " +
            "JOIN ParticipationHistory ph ON ph.project = p " +
            "WHERE ph.member = :member")
    Page<ProjectListResponseDTO> findProjectsWithThumbnailByParticipant(@Param("member") Member member, Pageable pageable);
}
