package com.obss.movietracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Date releaseDate;

    @Column(nullable = false)
    private float rating;

    @Column(nullable = false)
    private String duration;

    @Column
    private String imdbId;

    @Column
    private String image;

    @ManyToMany()
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Director> directors = new ArrayList<Director>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.PERSIST)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<MovieUserList> movieUserLists;

    @ManyToMany()
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<Genre> genres;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    public Movie(String name, Date releaseDate, float rating, String duration, String imdbId, List<Director> directors, Set<MovieUserList> movieUserLists, User user, Set<Genre> genres) {
        this.name = name;
        this.releaseDate = releaseDate;
        this.rating = rating;
        this.duration = duration;
        this.imdbId = imdbId;
        this.directors = directors;
        this.movieUserLists = movieUserLists;
        this.user = user;
        this.genres = genres;
    }

    public Movie() {
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

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        if(rating>10 || rating<0){
            this.rating = 0;
        }
        this.rating = rating;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getImdbId() {
        return imdbId;
    }

    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }

    public List<Director> getDirectors() {
        return directors;
    }

    public void setDirectors(List<Director> directors) {
        this.directors = directors;
    }

    public Set<MovieUserList> getMovieUserLists() {
        return movieUserLists;
    }

    public void setMovieUserLists(Set<MovieUserList> movieUserLists) {
        this.movieUserLists = movieUserLists;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", releaseDate=" + releaseDate +
                ", rating=" + rating +
                ", duration='" + duration + '\'' +
                ", imdbId='" + imdbId + '\'' +
                ", directors=" + directors +
                ", movieUserLists=" + movieUserLists +
                ", genres=" + genres +
                ", user=" + user +
                '}';
    }
}
