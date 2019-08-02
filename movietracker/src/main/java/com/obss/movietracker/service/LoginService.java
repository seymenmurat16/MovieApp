package com.obss.movietracker.service;

import com.obss.movietracker.entity.User;
import com.obss.movietracker.model.LoginModel;
import com.obss.movietracker.repository.UserRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService implements ILoginService{

    private final UserRepository userRepository;

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Boolean login(LoginModel loginModel) {
        User tempUser = userRepository.findByUsername(loginModel.getUsername());
        String sha256hex = DigestUtils.sha256Hex(loginModel.getPassword());
        if(tempUser == null || !tempUser.getPassword().equals(sha256hex)){
            return false;
        }
        return true;
    }
}
