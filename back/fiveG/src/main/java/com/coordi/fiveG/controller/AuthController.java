package com.coordi.fiveG.controller;

import com.coordi.fiveG.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersService usersService;

    @PostMapping("/login")
    public boolean login(@RequestBody LoginRequest loginRequest){
        String userId = loginRequest.userId;
        String pw = loginRequest.pw;
        return usersService.login(userId, pw);
    }
}
