package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Director;
import com.obss.movietracker.entity.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends CrudRepository<Genre,Long>, PagingAndSortingRepository<Genre, Long> {
    boolean existsByName(String name);
    Genre findByName(String name);
    Page<Genre> findAll(Pageable pageable);
}
