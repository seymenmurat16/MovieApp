package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Movie;
import com.obss.movietracker.entity.MovieList;
import com.obss.movietracker.entity.MovieUserList;
import com.obss.movietracker.entity.User;
import com.obss.movietracker.model.*;
import com.obss.movietracker.security.CurrentUser;
import com.obss.movietracker.security.JwtTokenProvider;
import com.obss.movietracker.security.UserPrincipal;
import com.obss.movietracker.service.MovieService;
import com.obss.movietracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserDetailsService userDetailsService;
    AuthenticationManager authManager;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    private final UserService userService;
    private final MovieService movieService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserController(UserService userService, MovieService movieService,BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.movieService = movieService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginModel loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        System.out.println(jwt);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @GetMapping("/me")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName(),
                currentUser.getAuthorities().stream().findFirst().get().getAuthority());
        return userSummary;
    }

    @PostMapping()
    public ResponseEntity<User> addUser(@RequestBody User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        ApiResponse apiResponse = userService.addUser(user);
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        ApiResponse apiResponse = userService.updateUser(user);
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        ApiResponse apiResponse = userService.deleteUserById(id);
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<User> getUsers() {
        String usernane = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return new ResponseEntity(userService.getUsers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        if (userService.getUserById(id) != null) {
            return new ResponseEntity(userService.getUserById(id), HttpStatus.OK);
        } else {
            return new ResponseEntity("Bu id numarasına sahip kullanıcı bulunamadı.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/list/{lid}/movies/{mid}")
    public ResponseEntity<User> addListToUser(@PathVariable Long lid, @PathVariable Long mid) {
        String usernane = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        MovieUserList movieUserList = new MovieUserList(userService.getUserByName(usernane), movieService.getMovieById(mid), movieService.getMovieListById(lid));
        userService.addMovieToList(movieUserList);
        return new ResponseEntity("Liste Eklendi.", HttpStatus.CREATED);
    }

    @GetMapping("/{id}/lists")
    public ResponseEntity<MovieList> getListFromUser(@PathVariable Long id) {
        String usernane = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return new ResponseEntity(userService.getListsFromUser(userService.getUserById(id)), HttpStatus.CREATED);
    }

    @DeleteMapping("/list/{lid}")
    public ResponseEntity<User> deleteListFromUser(@PathVariable Long lid) {
        String usernane = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        ApiResponse apiResponse = userService.deleteListFromUser(userService.getUserByName(usernane),movieService.getMovieListById(lid));
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/movie/{mid}")
    public ResponseEntity<User> addMovieToList(@PathVariable Long id, @PathVariable Long mid,@RequestBody FormModel model) {
        MovieUserList movieUserList = new MovieUserList(userService.getUserById(id), movieService.getMovieById(mid), movieService.getMovieListById(Long.parseLong(model.getName())));
        ApiResponse apiResponse = userService.addMovieToList(movieUserList);
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/lists/{lid}")
    public ResponseEntity<Movie> getMovieToList(@PathVariable Long id, @PathVariable Long lid) {
        return new ResponseEntity(userService.getMoviesFromList(userService.getUserById(id),movieService.getMovieListById(lid)), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/list/{lid}/movie/{mid}")
    public ResponseEntity<User> deleteMovieFromList(@PathVariable Long id,@PathVariable Long lid, @PathVariable Long mid) {
        MovieUserList movieUserList = new MovieUserList(userService.getUserById(id), movieService.getMovieById(mid), movieService.getMovieListById(lid));
        ApiResponse apiResponse = userService.deleteMovieFromList(movieUserList);
        if (apiResponse.getSuccess()) {
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity(apiResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/checkUsernameAvailability/{username}")
    public UserAvailable getMovieToList(@PathVariable String username) {
        Boolean isAvailable = !userService.usernameAvaiable(username);
        return new UserAvailable(isAvailable);
    }
}
