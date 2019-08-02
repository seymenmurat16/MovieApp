package com.obss.movietracker.controller;


import com.obss.movietracker.entity.MovieList;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.model.FormModel;
import com.obss.movietracker.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movieLists")
public class MovieListController {

    private final MovieService movieService;

    @Autowired
    public MovieListController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping()
    public ResponseEntity<MovieList> addMovieList(@RequestBody FormModel model){
        ApiResponse apiResponse = movieService.addMovieList(model.getName());
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }else{
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieList> updateMovieList(@PathVariable Long id,@RequestBody FormModel model){
        MovieList movieList = new MovieList();
        movieList.setId(id);
        movieList.setName(model.getName());
        ApiResponse apiResponse = movieService.updateMovieList(movieList);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MovieList> deleteMovieList(@PathVariable Long id){
        ApiResponse apiResponse = movieService.deleteMovieListById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<MovieList> getMovieLists(){
        return new ResponseEntity(movieService.getMovieLists(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieList> getMovieList(@PathVariable Long id){
        if(movieService.getMovieListById(id)!= null){
            return new ResponseEntity(movieService.getMovieListById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip MovieList bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

}

