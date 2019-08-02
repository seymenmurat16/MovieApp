package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Director;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectorRepository extends CrudRepository<Director,Long>, PagingAndSortingRepository<Director, Long> {
    boolean existsByName(String name);
    boolean existsByNameAndSurname(String name,String surname);
    Director findByNameAndSurname(String name,String surname);
}
