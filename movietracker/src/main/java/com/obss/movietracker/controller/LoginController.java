package com.obss.movietracker.controller;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.obss.movietracker.entity.Genre;
import com.obss.movietracker.entity.Place;
import com.obss.movietracker.model.LoginModel;
import com.obss.movietracker.repository.GenreRepository;
import com.obss.movietracker.service.LoginService;
import com.obss.movietracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;

@RestController
public class LoginController {

    private final LoginService loginService;
    private final UserService userService;
    @Autowired
    public LoginController(LoginService loginService,UserService userService) {
        this.loginService = loginService;
        this.userService = userService;
    }

    @PostMapping("/loginas")
    public ResponseEntity<LoginModel> login(@RequestBody LoginModel loginModel){
        System.out.println("login");
        if(loginService.login(loginModel)){
            return new ResponseEntity("Giris yapıldı.",HttpStatus.OK);
        }else{
            return new ResponseEntity("Giriş yapılamadı.",HttpStatus.CONFLICT);
        }
    }


  /*
    Api üzerinden veri çekilip veritabanına kaydedildi.
  @GetMapping("/loginas")
    public void login() throws IOException {
        final String uri = "https://il-ilce-rest-api.herokuapp.com/v1/cities";

        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(result);

        List<JsonNode> cities = jsonNode.findValues("name");
        for(JsonNode node : cities){
            userService.addPlace(new Place(node.asText(),null,null));
        }

        System.out.println(jsonNode.get("data").size());

        System.out.println(jsonNode.get("data").get(1).get("name").asText());
        System.out.println(result);
    }*/


}
