package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
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

    private String thumbnail;

    private String video;

    @Column(columnDefinition = "text")
    private String script;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @OneToMany(mappedBy = "recruitment")
    private List<Casting> castings = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "recruitment_genre",
            joinColumns = @JoinColumn(name = "recruitment_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "recruitment_category",
            joinColumns = @JoinColumn(name = "recruitment_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    @OneToMany(mappedBy = "recruitment")
    private List<Studio> studios = new ArrayList<>();

    @OneToMany(mappedBy = "recruitment")
    private List<File> recording = new ArrayList<>();
}