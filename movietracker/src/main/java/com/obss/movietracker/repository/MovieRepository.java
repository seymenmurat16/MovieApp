package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Movie;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends CrudRepository<Movie,Long>, PagingAndSortingRepository<Movie, Long> {
    //@Query("select t from Test t join User u where u.username = :username")
    Iterable<Movie> findMoviesByDirectors_Name(String name);
    Iterable<Movie> findMoviesByDirectors_Id(Long id);
    Iterable<Movie> findMoviesByName(String name);
    boolean existsByImdbId(String id);
}
