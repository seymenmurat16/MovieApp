package com.obss.movietracker.repository;

import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.MovieList;
import com.obss.movietracker.entity.MovieUserList;
import com.obss.movietracker.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MovieUserListRepository extends CrudRepository<MovieUserList,Long>{

    @Transactional
    @Query(value = "delete from movie_user_list where list_id = :list_id and movie_id= :movie_id and user_id = :user_id",nativeQuery = true)
    void delete(@Param("list_id") Long list_id, @Param("movie_id") Long movie_id, @Param("user_id") Long user_id);
}
