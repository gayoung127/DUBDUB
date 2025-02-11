package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class WorkspaceData extends Timestamped{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Recruitment project;

    @Column(columnDefinition = "json")
    private String workspaceData;

    @Builder
    public WorkspaceData(Recruitment project, String workspaceData) {
        this.project = project;
        this.workspaceData = workspaceData;
    }
}

