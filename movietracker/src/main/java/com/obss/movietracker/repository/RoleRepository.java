package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role,Long>, PagingAndSortingRepository<Role, Long> {
    boolean existsByName(String name);
    Role findByName(String name);
}
