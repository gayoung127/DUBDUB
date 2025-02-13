package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Genre;
import com.ssafy.dubdub.enums.GenreType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByGenreName(GenreType genreName);

    List<Genre> findByGenreNameIn(List<String> genreNames);
}
