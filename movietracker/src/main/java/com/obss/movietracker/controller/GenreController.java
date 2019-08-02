package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/genres")
public class GenreController {

    private final MovieService movieService;

    @Autowired
    public GenreController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping()
    public ResponseEntity<Genre> addGenre(@RequestBody Genre genre){
        ApiResponse apiResponse =movieService.addGenre(genre);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }else{
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id,@RequestBody Genre genre){
        genre.setId(id);
        ApiResponse apiResponse = movieService.updateGenre(genre);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Genre> deleteGenre(@PathVariable Long id){
        ApiResponse apiResponse = movieService.deleteGenreById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Genre> getGenres(){
        return new ResponseEntity(movieService.getGenres(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Genre> getGenre(@PathVariable Long id){
        if(movieService.getGenreById(id)!= null){
            return new ResponseEntity(movieService.getGenreById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip genre bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

}
