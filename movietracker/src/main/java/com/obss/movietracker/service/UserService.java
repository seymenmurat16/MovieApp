package com.obss.movietracker.service;

import com.obss.movietracker.entity.*;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.repository.MovieUserListRepository;
import com.obss.movietracker.repository.PlaceRepository;
import com.obss.movietracker.repository.RoleRepository;
import com.obss.movietracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService implements IUserService{

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PlaceRepository placeRepository;
    private final MovieUserListRepository movieUserListRepository;

    @Autowired
    public UserService(UserRepository userRepository,RoleRepository roleRepository,PlaceRepository placeRepository,MovieUserListRepository movieUserListRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.placeRepository = placeRepository;
        this.movieUserListRepository = movieUserListRepository;
    }

    @Override
    public ApiResponse addUser(User user) {
        if(userRepository.existsByUsername(user.getUsername())){
            return new ApiResponse(false,"There is a User with the same username");
        }
        if(placeRepository.existsByName(user.getPlace().getName())){
            user.setPlace(placeRepository.findByName(user.getPlace().getName()));
        }
        Set<Role> roles =  new HashSet<>();
        roles.add(roleRepository.findByName("User"));
        user.setRoles(roles);
        userRepository.save(user);
        return new ApiResponse(true,"User saved.");
    }

    @Override
    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public ApiResponse deleteUserById(long id) {
        if(!userRepository.existsById(id)){
            return  new ApiResponse(false,"No User found with this id.");
        }
        userRepository.deleteById(id);
        return new ApiResponse(true,"User deleted.");
    }

    @Override
    public ApiResponse updateUser(User user){
        if(!userRepository.existsById(user.getId())){
            return  new ApiResponse(false,"No User found with this id.");
        }
        if(placeRepository.existsByName(user.getPlace().getName())){
            user.setPlace(placeRepository.findByName(user.getPlace().getName()));
        }else{
            addPlace(user.getPlace().getName());
            user.setPlace(placeRepository.findByName(user.getPlace().getName()));
        }
        userRepository.save(user);
        return new ApiResponse(true,"User updated.");
    }

    @Override
    public User getUserById(long id) {
        if(!userRepository.existsById(id)){
            return null;
        }
        User user = new User();
        user = userRepository.findById(id).get();
        return user;
    }

    @Override
    public User getUserByName(String name) {
        return userRepository.findByUsername(name);
    }

    @Override
    public ApiResponse addRole(Role role) {
        if(!roleRepository.existsByName(role.getName())){
            roleRepository.save(role);
            return new ApiResponse(true,"Role saved.");
        }
        return new ApiResponse(false,"There is a Role with the same name");
    }

    @Override
    public Iterable<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public ApiResponse deleteRoleById(long id) {
        if(!roleRepository.existsById(id)){
            return  new ApiResponse(false,"No Role found with this id.");
        }
        roleRepository.deleteById(id);
        return new ApiResponse(true,"Role deleted.");
    }

    @Override
    public ApiResponse updateRole(Role role) {
        if(!roleRepository.existsById(role.getId())){
            return  new ApiResponse(false,"No Role found with this id.");
        }
        roleRepository.save(role);
        return new ApiResponse(true,"Role updated.");
    }

    @Override
    public Role getRoleById(long id) {
        if(!roleRepository.existsById(id)){
            return null;
        }
        return roleRepository.findById(id).get();
    }

    @Override
    public ApiResponse addPlace(String name) {
        if(!placeRepository.existsByName(name)){
            Place place = new Place();
            place.setName(name);
            placeRepository.save(place);
            return new ApiResponse(true,"Place saved.");
        }
        return new ApiResponse(false,"There is a Place with the same name");
    }

    @Override
    public Iterable<Place> getPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public ApiResponse deletePlaceById(long id) {
        if(!placeRepository.existsById(id)){
            return  new ApiResponse(false,"No Place found with this id.");
        }
        placeRepository.deleteById(id);
        return new ApiResponse(true,"Place deleted.");
    }

    @Override
    public ApiResponse updatePlace(Place place) {
        if(!placeRepository.existsById(place.getId())){
            return  new ApiResponse(false,"No Place found with this id.");
        }
        placeRepository.save(place);
        return new ApiResponse(true,"Place updated.");
    }

    @Override
    public Place getPlaceById(long id) {
        if(!placeRepository.existsById(id)){
            return null;
        }
        return placeRepository.findById(id).get();
    }

    @Override
    public ApiResponse addMovieToList(MovieUserList movieUserList) {
        if(movieUserList.getUser() == null || movieUserList.getUser() == null || movieUserList.getMovie() == null){
            return new ApiResponse(false,"There is no data with list or movie.");
        }
        List<Long> tableId = userRepository.selectQuery(movieUserList.getList().getId(),
                movieUserList.getMovie().getId(),
                movieUserList.getUser().getId());
        if(tableId.size()==0){
            movieUserListRepository.save(movieUserList);
            return new ApiResponse(true,"Movie saved to List");
        }
        return new ApiResponse(false,"There is a movie with that name in your list.");
    }

    @Override
    public Iterable<Movie> getMoviesFromList(User user, MovieList list) {
        Iterable<MovieUserList> movieUserListList = movieUserListRepository.findAll();
        List<Movie> movies = new ArrayList<>();
        for(MovieUserList mul : movieUserListList){
            System.out.println(mul.getId());
            if(mul.getList().getId() == list.getId() && mul.getUser().getId() == user.getId())
                movies.add(mul.getMovie());
        }
        return movies;
    }

    @Override
    public ApiResponse deleteMovieFromList(MovieUserList movieUserList) {
        if(movieUserList.getUser() == null || movieUserList.getUser() == null || movieUserList.getMovie() == null){
            return new ApiResponse(false,"There is no data with list or movie.");
        }
        List<Long> tableId = userRepository.selectQuery(movieUserList.getList().getId(),
                movieUserList.getMovie().getId(),
                movieUserList.getUser().getId());
        if(tableId.size()==0){
            return new ApiResponse(false,"There is not movie with that name in your list.");
        }
        for(int i=0;i<tableId.size();i++){
            movieUserListRepository.deleteById(tableId.get(i));
        }
        return new ApiResponse(true,"Movie deleted from List");
    }

    @Override
    public Iterable<MovieList> getListsFromUser(User user) {
        Iterable<MovieUserList> movieUserListList = movieUserListRepository.findAll();
        Set<MovieList> list = new HashSet<>();
        for(MovieUserList mul : movieUserListList){
            if(mul.getUser().getId() == user.getId())
                list.add(mul.getList());
        }
        return list;
    }

    @Override
    public ApiResponse deleteListFromUser(User user,MovieList list) {
        Iterable<MovieUserList> movieUserListList = movieUserListRepository.findAll();
        List<Long> tableId = new ArrayList<>();
        for(MovieUserList mul : movieUserListList){
            if(mul.getList().getId() == list.getId() && mul.getUser().getId() == user.getId()) {
                tableId = userRepository.selectQuery(mul.getList().getId(),
                        mul.getMovie().getId(),
                        mul.getUser().getId());
                for (int i = 0; i < tableId.size(); i++) {
                    movieUserListRepository.deleteById(tableId.get(i));
                }
            }
        }
        return new ApiResponse(true,"List deleted from User");
    }

    @Override
    public Boolean usernameAvaiable(String username) {
        return userRepository.existsByUsername(username);
    }
}
