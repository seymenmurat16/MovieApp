package com.obss.movietracker;

import com.obss.movietracker.entity.Place;
import com.obss.movietracker.entity.Role;
import com.obss.movietracker.entity.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class MovietrackerApplication {

    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(MovietrackerApplication.class, args);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
