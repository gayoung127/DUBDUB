package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Snapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SnapshotRepository extends JpaRepository<Snapshot, Long> {
    @Query("SELECT w FROM Snapshot w WHERE w.project.id = :projectId " +
            "AND w.id = (SELECT MAX(w2.id) FROM Snapshot w2 WHERE w2.project.id = :projectId)")
    Optional<Snapshot> findLatestWorkspaceData(@Param("projectId") Long projectId);
}
