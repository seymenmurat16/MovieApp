package com.obss.movietracker.model;

public class AddMovieToListForm {
    String name;
    public AddMovieToListForm(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
