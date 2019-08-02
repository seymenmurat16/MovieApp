package com.obss.movietracker.service;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.entity.MovieList;
import com.obss.movietracker.model.ApiResponse;

import java.io.IOException;
import java.text.ParseException;
import java.util.Set;

public interface IMovieService {
    ApiResponse addMovie(Movie movie);
    ApiResponse addImdbMovie(String name,String username) throws IOException, ParseException;
    Iterable<Movie> getMovies();
    ApiResponse deleteMovieById(long id);
    ApiResponse updateMovie(Movie movie);
    Movie getMovieById(long id);
    ApiResponse addGenre(Genre genre);
    Iterable<Genre> getGenres();
    ApiResponse deleteGenreById(long id);
    ApiResponse updateGenre(Genre genre);
    Genre getGenreById(long id);
    Set<Genre> getGenres(String genreFull);
    ApiResponse addMovieList(String name);
    Iterable<MovieList> getMovieLists();
    ApiResponse deleteMovieListById(long id);
    ApiResponse updateMovieList(MovieList movieList);
    MovieList getMovieListById(long id);
    MovieList getMovieListByName(String name);
}
