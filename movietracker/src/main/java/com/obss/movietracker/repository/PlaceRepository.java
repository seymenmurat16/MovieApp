package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Place;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends CrudRepository<Place,Long>, PagingAndSortingRepository<Place, Long> {
        boolean existsByName(String name);
        Place findByName(String name);
}
