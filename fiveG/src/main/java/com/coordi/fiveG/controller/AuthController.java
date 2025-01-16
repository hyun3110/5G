package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.User;
import com.coordi.fiveG.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public boolean login(@RequestBody LoginRequest loginRequest) {
        System.out.println(loginRequest.getUserid() + loginRequest.getPassword());
        return userService.login(loginRequest.getUserid(), loginRequest.getPassword());
    }
}
