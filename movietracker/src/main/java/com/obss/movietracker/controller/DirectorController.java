package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Director;
import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.service.DirectorService;
import com.obss.movietracker.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/directors")
public class DirectorController {

    private final DirectorService directorService;

    @Autowired
    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

    @PostMapping()
    public ResponseEntity<Director> addDirector(@RequestBody Director director){
        ApiResponse apiResponse = directorService.addDirector(director);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Director> updateDirector(@PathVariable Long id,@RequestBody Director director){
        director.setId(id);
        ApiResponse apiResponse = directorService.updateDirector(director);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Director> deleteDirector(@PathVariable Long id){
        ApiResponse apiResponse = directorService.deleteDirectorById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Director> getDirectors(){
        return new ResponseEntity(directorService.getDirectors(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Director> getDirector(@PathVariable Long id){
        if(directorService.getDirectorById(id)!= null){
            return new ResponseEntity(directorService.getDirectorById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip movie bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/movies")
    public ResponseEntity<Movie> getDirectorsMovies(@PathVariable Long id){
        return new ResponseEntity(directorService.getDirectorsMovieById(id), HttpStatus.OK);
    }
}
