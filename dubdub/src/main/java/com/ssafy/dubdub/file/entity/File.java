package com.ssafy.dubdub.file.entity;

import com.ssafy.dubdub.recruitment.entity.Recruitment;
import com.ssafy.dubdub.file.entity.Enum.FileStatus;
import com.ssafy.dubdub.file.entity.Enum.FileType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class File {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id")
    private Recruitment recruitment;

    @Column(nullable = false)
    private String fullUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileType fileType;

    @Column(nullable = false)
    private String bucketName;

    @Column(nullable = false)
    private String folderName;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private FileStatus fileStatus;
}
