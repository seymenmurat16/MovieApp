package com.obss.movietracker.service;

import com.obss.movietracker.entity.*;
import com.obss.movietracker.model.ApiResponse;

import java.util.List;

public interface IUserService {
    ApiResponse addUser(User user);
    Iterable<User> getUsers();
    ApiResponse deleteUserById(long id);
    ApiResponse updateUser(User user);
    User getUserById(long id);
    User getUserByName(String name);
    ApiResponse addRole(Role role);
    Iterable<Role> getRoles();
    ApiResponse deleteRoleById(long id);
    ApiResponse updateRole(Role role);
    Role getRoleById(long id);
    ApiResponse addPlace(String name);
    Iterable<Place> getPlaces();
    ApiResponse deletePlaceById(long id);
    ApiResponse updatePlace(Place place);
    Place getPlaceById(long id);
    ApiResponse addMovieToList(MovieUserList movieUserList);
    Iterable<Movie> getMoviesFromList(User user,MovieList list);
    ApiResponse  deleteMovieFromList(MovieUserList movieUserList);
    Iterable<MovieList> getListsFromUser(User user);
    ApiResponse deleteListFromUser(User user, MovieList list);
    Boolean usernameAvaiable(String username);
}
