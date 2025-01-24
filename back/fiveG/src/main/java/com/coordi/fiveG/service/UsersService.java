package com.coordi.fiveG.service;

import com.coordi.fiveG.controller.SignupDto;
import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    // 로그인
    public boolean login(String userId, String pw){
        Users user = usersRepository.findByUserId(userId);
        return user != null && user.getPw().equals(pw);
    }

    // 회원가입
    public Users signup(SignupDto sDto){
        Users user = new Users();
        user.setUserId(sDto.getUserId());
        user.setPw(sDto.getPw());
        user.setName(sDto.getName());
        user.setPhone(sDto.getPhone());
        user.setEmail(sDto.getEmail());
        user.setJoinedAt(LocalDateTime.now());

        return usersRepository.save(user);
    }

    // 아이디 중복 체크
    public boolean userIdCheck(String userId){
        return usersRepository.existsByUserId(userId);
    }

}
