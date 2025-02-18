package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Snapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SnapshotRepository extends JpaRepository<Snapshot, Long> {

    Optional<Snapshot> findFirstByProjectIdOrderByCreatedAtDesc(Long projectId);
}
