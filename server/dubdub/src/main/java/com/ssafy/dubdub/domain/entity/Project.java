package com.ssafy.dubdub.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Project extends Timestamped {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Member owner;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String script;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Casting> castings = new ArrayList<>();

    @Builder
    public Project(Member owner, String title, String script) {
        this.owner = owner;
        this.title = title;
        this.script = script;
    }

    public void addCasting(Casting casting) {
        castings.add(casting);
    }
}