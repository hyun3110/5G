package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersService usersService;

    // 로그인
    @PostMapping("/login")
    public boolean login(@RequestBody LoginRequest loginRequest){
        String userId = loginRequest.userId;
        String pw = loginRequest.pw;
        return usersService.login(userId, pw);
    }

    // 회원가입
    @PostMapping("/signup")
    public Users signup(@RequestBody SignupDto user){
        return usersService.signup(user);
    }

    // 아이디 중복 체크
    @GetMapping("/userIdCheck")
    public boolean userIdCheck(@RequestParam("userId") String userId){
        System.out.println(userId);
        return usersService.userIdCheck(userId);
    }

}
