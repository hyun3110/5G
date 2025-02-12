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
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO, HttpSession session){
        Users user = usersService.login(userDTO.getUserId(),userDTO.getPw());

        if (user != null){
            session.setAttribute("user", user);
            return ResponseEntity.ok("로그인 성공");
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    // 회원가입
    @PostMapping("/signup")
    public Users signup(@RequestBody UserDTO user){
        return usersService.signup(user);
    }

    // 아이디 중복 체크
    @GetMapping("/useridcheck")
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

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        // 세션에서 유저 정보 삭제
        session.invalidate();  // 세션을 종료하고 모든 속성 삭제

        // 성공적인 로그아웃 응답
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 비밀번호 확인
    @PostMapping("/verifypassword")
    public boolean verifyPassword(@RequestBody UserDTO userDTO){
        return usersService.verifyPassword(userDTO);
    }

    // 회원정보 변경
    @PutMapping("/useredit")
    public ResponseEntity<Users> updateUser(@RequestBody UserDTO userDTO, HttpSession session){
        Users user = usersService.updateUser(userDTO);
        if (user != null){
            session.invalidate();
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // 아이디 찾기
    @PostMapping("/findid")
    public ResponseEntity<?> findId(@RequestParam("name") String name, @RequestParam("residentNum") String residentNum){
        Users user = usersService.findId(name, residentNum);
        if (user != null){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // 비밀번호 찾기
    @PostMapping("/findpw")
    public ResponseEntity<?> findPw(@RequestParam("userId") String userId,@RequestParam("name") String name, @RequestParam("residentNum") String residentNum){
        Users user = usersService.findPw(userId, name, residentNum);
        if (user != null){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // 비밀번호 재설정
    @PostMapping("/resetpassword")
    public ResponseEntity<?> resetPw(@RequestParam("userId") String userId,@RequestParam("pw") String pw){
        Users user = usersService.resetPw(userId, pw);
        if (user != null){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
