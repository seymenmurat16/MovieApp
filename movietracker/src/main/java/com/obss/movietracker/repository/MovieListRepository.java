package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.MovieList;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface MovieListRepository extends CrudRepository<MovieList,Long>, PagingAndSortingRepository<MovieList, Long> {
    boolean existsByName(String name);
    MovieList getByName(String name);
    MovieList findByName(String name);
}
