package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Recruitment extends Timestamped {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Member author;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String content;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private boolean isRecruiting;

    @Column(columnDefinition = "text")
    private String script;

    @Column(nullable = false)
    private boolean isPrivate;

    @OneToMany(mappedBy = "recruitment", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<Casting> castings = new ArrayList<>();

    @OneToMany(mappedBy = "recruitment", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<RecruitmentGenre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "recruitment", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<RecruitmentCategory> categories = new ArrayList<>();

    @Builder
    public Recruitment(Member author, String title, String content, LocalDateTime startTime, LocalDateTime endTime, boolean isRecruiting, String script, boolean isPrivate) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isRecruiting = isRecruiting;
        this.script = script;
        this.isPrivate = isPrivate;
    }

    public void addCasting(Casting casting) {
        castings.add(casting);
    }

    public void addGenre(RecruitmentGenre recruitmentGenre) {
        genres.add(recruitmentGenre);
    }

    public void addCategory(RecruitmentCategory recruitmentCategory) {
        categories.add(recruitmentCategory);
    }
}