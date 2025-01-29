package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Studio extends Timestamped {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id", insertable = false, updatable = false)
    private Recruitment recruitment;

    @Column(nullable = false)
    private boolean isClosed;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;
}
