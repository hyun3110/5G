package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.service.UsersService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersService usersService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpSession session){
        Users user = usersService.login(loginRequest.getUserId(),loginRequest.getPw());

        if (user != null){
            session.setAttribute("user", user);
            return ResponseEntity.ok("로그인 성공");
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    // 회원가입
    @PostMapping("/signup")
    public Users signup(@RequestBody SignupDTO user){
        return usersService.signup(user);
    }

    // 아이디 중복 체크
    @GetMapping("/userIdCheck")
    public boolean userIdCheck(@RequestParam("userId") String userId){
        System.out.println(userId);
        return usersService.userIdCheck(userId);
    }

    // 세션에서 유저정보 불러오기
    @GetMapping("userinfo")
    public ResponseEntity<Users> getUserInfo(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);  // 세션에 저장된 유저 정보 반환
        } else {
            System.out.println("로그인되지 않은 상태");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // 로그인되지 않은 경우
        }
    }

}
