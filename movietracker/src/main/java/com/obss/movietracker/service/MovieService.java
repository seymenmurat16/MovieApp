package com.obss.movietracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.obss.movietracker.entity.*;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.repository.GenreRepository;
import com.obss.movietracker.repository.MovieListRepository;
import com.obss.movietracker.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class MovieService implements IMovieService{

    private final MovieRepository movieRepository;
    private final UserService userService;
    private final GenreRepository genreRepository;
    private final MovieListRepository movieListRepository;
    private DirectorService directorService;
    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

    @Autowired
    public MovieService(MovieRepository movieRepository,GenreRepository genreRepository,MovieListRepository movieListRepository,UserService userService,DirectorService directorService) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.movieListRepository  = movieListRepository;
        this.userService  = userService;
        this.directorService  = directorService;
    }

    @Override
    public ApiResponse addMovie(Movie movie) {
        movieRepository.save(movie);
        return new ApiResponse(true,"Movie saved.");
    }

    @Override
    public ApiResponse addImdbMovie(String name,String username) {
        String uri;
        if(name.startsWith("tt")){
            uri = "http://www.omdbapi.com/?i=";
            uri = uri.concat(name).concat("&apikey=3c5b862c");
            System.out.println("idd girdi");
        }else{
            uri = "http://www.omdbapi.com/?t=";
            uri = uri.concat(name).concat("&apikey=3c5b862c");
        }
        SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy", Locale.ENGLISH);
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class,name);
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println(result);
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(result);
        } catch (IOException e) {
            logger.warn(e.getMessage());
        }

        if(jsonNode.get("Response").asText().equals("True") && !movieRepository.existsByImdbId(jsonNode.get("imdbID").asText())){
            Movie movie = new Movie();
            movie.setName(jsonNode.get("Title").asText());
            movie.setUser(userService.getUserByName(username));
            String directorFullName  = jsonNode.get("Director").asText();
            movie.setDirectors(directorService.getDirectors(directorFullName));
            String genreFull  = jsonNode.get("Genre").asText();
            movie.setGenres(getGenres(genreFull));
            movie.setImage(jsonNode.get("Poster").asText());
            movie.setImdbId(jsonNode.get("imdbID").asText());
            movie.setDuration(jsonNode.get("Runtime").asText());
            String rating =  jsonNode.get("imdbRating").asText();
            if(rating.equals("N/A")){
                movie.setRating(0);
            }else{
                movie.setRating(Float.parseFloat(rating));
            }
            String date = jsonNode.get("Released").asText();
            System.out.println("date" + date);
            Date releaseDate = new Date(1000);
            try {
                releaseDate = formatter.parse(date);
            } catch (ParseException e) {
                logger.warn(e.getMessage());
                e.getStackTrace();
                System.out.println("hatata");
            }
            System.out.println("date2" + releaseDate);
            movie.setReleaseDate(releaseDate);
            System.out.println(movie);
            movieRepository.save(movie);

            return new ApiResponse(true,"Movie saved from IMDB.");
        }
        if(jsonNode.get("Response").asText().equals("False")){
            return new ApiResponse(false,"Movie not found from IMDB.");
        }
        else{
            return new ApiResponse(false,"There is a movie with the same IMDBID");
        }
    }

    @Override
    public Iterable<Movie> getMovies() {
        return movieRepository.findAll();
    }

    @Override
    public ApiResponse deleteMovieById(long id) {
        if(!movieRepository.existsById(id)){
            return new ApiResponse(false,"No movie found with this id.");
        }
        movieRepository.deleteById(id);
        return new ApiResponse(true,"Movie deleted.");

    }

    @Override
    public ApiResponse updateMovie(Movie movie) {
        if(!movieRepository.existsById(movie.getId())){
            return  new ApiResponse(false,"No movie found with this id.");
        }
        movieRepository.save(movie);
        return new ApiResponse(true,"Movie updated.");
    }

    @Override
    public Movie getMovieById(long id) {
        if(!movieRepository.existsById(id)){
            return null;
        }
        return movieRepository.findById(id).get();
    }

    @Override
    public ApiResponse addGenre(Genre genre) {
        if(!genreRepository.existsByName(genre.getName())){
            genreRepository.save(genre);
            return new ApiResponse(true,"Genre saved.");
        }
        return new ApiResponse(false,"There is a genre with the same name");
    }

    @Override
    public Iterable<Genre> getGenres() {
        Iterable<Genre> allProductsSortedByName = genreRepository.findAll(Sort.by("name"));
        return allProductsSortedByName;
    }

    @Override
    public ApiResponse deleteGenreById(long id) {
        if(!genreRepository.existsById(id)){
            return  new ApiResponse(false,"No movie found with this id.");
        }
        genreRepository.deleteById(id);
        return new ApiResponse(true,"Genre deleted.");
    }

    @Override
    public ApiResponse updateGenre(Genre genre) {
        if(!genreRepository.existsById(genre.getId())){
            return  new ApiResponse(false,"No genre found with this id.");
        }
        genreRepository.save(genre);
        return new ApiResponse(true,"Genre updated.");
    }

    @Override
    public Genre getGenreById(long id) {
        if(!genreRepository.existsById(id)){
            return null;
        }
        return genreRepository.findById(id).get();
    }

    @Override
    public Set<Genre> getGenres(String genreFull) {
        String genres[] = genreFull.split(",");
        Set<Genre> genreList = new HashSet<>();
        for (String s:genres){
            s = s.replaceAll("\\s+","");
            if(!genreRepository.existsByName(s)){
                Genre genre = new Genre(s);
                genreRepository.save(genre);
                genreList.add(genre);
            }
            genreList.add(genreRepository.findByName(s));
        }
        return genreList;
    }

    @Override
    public ApiResponse addMovieList(String name) {
        if (!movieListRepository.existsByName(name)) {
            MovieList movieList = new MovieList();
            movieList.setName(name);
            movieListRepository.save(movieList);
            return new ApiResponse(true,"MovieList saved.");
        }
        return new ApiResponse(false,"There is a MovieList with the same name");
    }

    @Override
    public Iterable<MovieList> getMovieLists() {
        return movieListRepository.findAll();
    }

    @Override
    public ApiResponse deleteMovieListById(long id) {
        if(!movieListRepository.existsById(id)){
            return  new ApiResponse(false,"No MovieList found with this id.");
        }
        movieListRepository.deleteById(id);
        return new ApiResponse(true,"MovieList deleted.");
    }

    @Override
    public ApiResponse updateMovieList(MovieList movieList) {
        if(!movieListRepository.existsById(movieList.getId())){
            return  new ApiResponse(false,"No MovieList found with this id.");
        }
        movieListRepository.save(movieList);
        return new ApiResponse(true,"MovieList updated.");
    }

    @Override
    public MovieList getMovieListById(long id) {
        if(!movieListRepository.existsById(id)){
            return null;
        }
        return movieListRepository.findById(id).get();
    }

    @Override
    public MovieList getMovieListByName(String name) {
        return movieListRepository.getByName(name);
    }

}
