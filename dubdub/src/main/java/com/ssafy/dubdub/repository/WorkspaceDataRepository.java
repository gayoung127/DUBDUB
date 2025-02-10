package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.WorkspaceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WorkspaceDataRepository extends JpaRepository<WorkspaceData, Long> {
    @Modifying
    @Query("SELECT MAX(w.workspaceVersion) FROM WorkspaceData w WHERE w.project.id = :projectId")
    Optional<Integer> findLatestWorkspaceVersion(@Param("projectId") Long projectId);
    @Query("SELECT w FROM WorkspaceData w WHERE w.project.id = :projectId AND w.workspaceVersion = " +
            "(SELECT MAX(w2.workspaceVersion) FROM WorkspaceData w2 WHERE w2.project.id = :projectId)")
    Optional<WorkspaceData> findLatestWorkspaceData(@Param("projectId") Long projectId);
}
