package com.obss.movietracker.service;

import com.obss.movietracker.entity.Director;
import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.model.ApiResponse;

import java.util.List;

public interface IDirectorService {
    ApiResponse addDirector(Director director);
    Iterable<Director> getDirectors();
    ApiResponse deleteDirectorById(long id);
    ApiResponse updateDirector(Director director);
    Director getDirectorById(long id);
    Iterable<Movie> getDirectorsMovieByName(String name);
    Iterable<Movie> getDirectorsMovieById(Long id);
    Director getDirector(String director);
    List<Director> getDirectors(String directorFullName);
}
