package com.ssafy.dubdub.domain.entity;

import com.ssafy.dubdub.enums.FileStatus;
import com.ssafy.dubdub.enums.FileType;
import jakarta.persistence.*;
import lombok.Builder;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileType fileType;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    private FileStatus fileStatus;


    @Builder
    public File(Recruitment recruitment, String url, FileType fileType) {
        this.recruitment = recruitment;
        this.url = url;
        this.fileType = fileType;
        this.fileStatus = FileStatus.ACTIVE;
    }
}