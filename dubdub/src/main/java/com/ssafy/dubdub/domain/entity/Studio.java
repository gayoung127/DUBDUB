package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Studio extends Timestamped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id")
    private Recruitment recruitment;

    @Column(nullable = false)
    private boolean isClosed;

    @Column
    private LocalDateTime closedAt;

    @Column
    private String session;

    public Studio(Recruitment recruitment, String session) {
        this.recruitment = recruitment;
        this.session = session;
    }

    public void close() {
        this.isClosed = true;
        this.closedAt = LocalDateTime.now();
    }
}
