package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.model.FormModel;
import com.obss.movietracker.service.MovieService;
import com.obss.movietracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RestController
@RequestMapping("/movies")
public class MovieController {
    private final MovieService movieService;
    private final UserService userService;
    @Autowired
    public MovieController(MovieService movieService,UserService userService) {
        this.movieService = movieService;
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie){
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        movie.setUser(userService.getUserByName(username));
        movieService.addMovie(movie);
        return new ResponseEntity("Kayıt edildi.", HttpStatus.CREATED);
    }

    @PostMapping("/imdb")
    public ResponseEntity<Movie> addImdbMovie(@RequestBody FormModel model) throws IOException, ParseException {
        ApiResponse apiResponse = movieService.addImdbMovie(model.getName(),model.getUsername());
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }
        return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id,@RequestBody Movie movie){
        movie.setId(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        movie.setUser(userService.getUserByName(username));
        ApiResponse apiResponse =movieService.updateMovie(movie);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Movie> deleteMovie(@PathVariable Long id){
        ApiResponse apiResponse = movieService.deleteMovieById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Movie> getMovies(){
        System.out.println("movies" +
                " ");
        return new ResponseEntity(movieService.getMovies(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable Long id){
        if(movieService.getMovieById(id)!= null){
            Movie a = movieService.getMovieById(id);
            return new ResponseEntity(movieService.getMovieById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip movie bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

}
