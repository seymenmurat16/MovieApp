package com.obss.movietracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
public class MovieList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<MovieUserList> movieUserLists;

    public MovieList(String name, Set<MovieUserList> movieUserLists) {
        this.name = name;
        this.movieUserLists = movieUserLists;
    }

    public MovieList() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<MovieUserList> getMovieUserLists() {
        return movieUserLists;
    }

    public void setMovieUserLists(Set<MovieUserList> movieUserLists) {
        this.movieUserLists = movieUserLists;
    }
}
