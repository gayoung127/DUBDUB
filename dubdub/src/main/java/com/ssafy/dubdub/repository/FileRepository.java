package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.File;
import com.ssafy.dubdub.enums.FileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    Optional<File> findByRecruitmentIdAndFileType(Long recruitmentId, FileType fileType);
}
