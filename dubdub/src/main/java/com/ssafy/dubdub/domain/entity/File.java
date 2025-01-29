package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.FileStatus;
import com.ssafy.dubdub.enums.FileType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class File extends Timestamped{
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

    @Enumerated(EnumType.STRING)
    private FileStatus fileStatus;
}
