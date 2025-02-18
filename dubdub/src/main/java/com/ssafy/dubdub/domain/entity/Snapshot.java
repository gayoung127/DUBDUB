package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Snapshot extends Timestamped{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(columnDefinition = "text")
    private String tracks;

    @Column(columnDefinition = "text")
    private String assets;

    @Column(columnDefinition = "text")
    private String audioBlocks;

    @Builder
    public Snapshot(Project project, String tracks, String assets, String audioBlocks) {
        this.project = project;
        this.tracks = tracks;
        this.assets = assets;
        this.audioBlocks = audioBlocks;
    }
}

