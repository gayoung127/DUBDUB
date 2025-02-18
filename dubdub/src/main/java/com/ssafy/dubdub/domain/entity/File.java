package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.FileType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class File extends Timestamped{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileType fileType;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private boolean isDeleted;

    @Builder
    public File(Project project, String url, FileType fileType) {
        this.project = project;
        this.url = url;
        this.fileType = fileType;
        this.isDeleted = false;
    }
}