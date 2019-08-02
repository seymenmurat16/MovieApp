package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Place;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.model.FormModel;
import com.obss.movietracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/places")
public class PlaceController {

    private final UserService userService;

    @Autowired
    public PlaceController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<Place> addPlace(@RequestBody FormModel model){
        ApiResponse apiResponse = userService.addPlace(model.getName());
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }else{
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable Long id, @RequestBody FormModel model){
        Place place = new Place();
        place.setId(id);
        place.setName(model.getName());
        ApiResponse apiResponse = userService.updatePlace(place);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Place> deletePlace(@PathVariable Long id){
        ApiResponse apiResponse = userService.deletePlaceById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Place> getPlaces(){
        return new ResponseEntity(userService.getPlaces(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlace(@PathVariable Long id){
        if(userService.getPlaceById(id)!= null){
            return new ResponseEntity(userService.getPlaceById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip place bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

}
