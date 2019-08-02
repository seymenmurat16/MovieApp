package com.obss.movietracker.service;

import com.obss.movietracker.entity.Director;
import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.entity.Place;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.repository.DirectorRepository;
import com.obss.movietracker.repository.MovieRepository;
import com.obss.movietracker.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DirectorService implements IDirectorService {

    private final DirectorRepository directorRepository;
    private final MovieRepository movieRepository;
    private final PlaceRepository placeRepository;
    @Autowired
    public DirectorService(DirectorRepository directorRepository,MovieRepository movieRepository,PlaceRepository placeRepository) {
        this.directorRepository = directorRepository;
        this.movieRepository = movieRepository;
        this.placeRepository = placeRepository;
    }

    @Override
    public ApiResponse addDirector(Director director) {
        if(placeRepository.existsByName(director.getPlace().getName())){
            director.setPlace(placeRepository.findByName(director.getPlace().getName()));
        }
        directorRepository.save(director);
        return new ApiResponse(true,"Director saved.");
    }

    @Override
    public Iterable<Director> getDirectors() {
        return directorRepository.findAll();
    }

    @Override
    public ApiResponse deleteDirectorById(long id) {
        if(!directorRepository.existsById(id)){
            return new ApiResponse(false,"No director found with this id.");
        }
        directorRepository.deleteById(id);
        return new ApiResponse(true,"Director deleted.");
    }

    @Override
    public ApiResponse updateDirector(Director director) {
        if(!directorRepository.existsById(director.getId())){
            return new ApiResponse(false,"No director found with this id.");
        }
        if(placeRepository.existsByName(director.getPlace().getName())){
            director.setPlace(placeRepository.findByName(director.getPlace().getName()));
        }else{
            placeRepository.save(new Place(director.getPlace().getName(),null,null));
            director.setPlace(placeRepository.findByName(director.getPlace().getName()));
        }
        directorRepository.save(director);
        return new ApiResponse(true,"Director updated.");
    }

    @Override
    public Director getDirectorById(long id) {
        if(!directorRepository.existsById(id)){
            return null;
        }
        return directorRepository.findById(id).get();
    }

    @Override
    public Iterable<Movie> getDirectorsMovieByName(String name) {
        return  movieRepository.findMoviesByDirectors_Name(name);
    }

    @Override
    public Iterable<Movie> getDirectorsMovieById(Long id) {
        return movieRepository.findMoviesByDirectors_Id(id);
    }

    @Override
    public Director getDirector(String director) {
        String directorNames[] = director.split(" ", 2);
        if(directorNames.length==1){
            directorNames = new String[]{directorNames[0], directorNames[0]};
        }
        System.out.println(directorNames[0]);
        System.out.println(directorNames[1]);
        String name = directorNames[0];
        String surname = directorNames[1];
        if(directorRepository.existsByNameAndSurname(name,surname)){
            return directorRepository.findByNameAndSurname(name,surname);
        }else{
            return directorRepository.save(new Director(name,surname,new Date(1000),null));
        }

    }

    @Override
    public List<Director> getDirectors(String directorFullName) {
        String directors[] = directorFullName.split(",");
        List<Director> directorList = new ArrayList<>();
        for (String s:directors){
            if(s.startsWith(" ")){
                s = s.replaceAll("\\s+","");
            }
            directorList.add(getDirector(s));
        }
        return directorList;
    }
}
