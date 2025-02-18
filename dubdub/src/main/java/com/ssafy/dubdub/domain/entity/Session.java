package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Session extends Timestamped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column
    private String session;

    @Column(nullable = false)
    private boolean isClosed;

    @Column
    private LocalDateTime closedAt;

    public Session(Project project, String session) {
        this.project = project;
        this.session = session;
    }

    public void close() {
        this.isClosed = true;
        this.closedAt = LocalDateTime.now();
    }
}
