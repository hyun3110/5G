package com.coordi.fiveG.service;

import com.coordi.fiveG.controller.UserDTO;
import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    // 로그인
    public Users login(String userId, String pw){

        // DB에서 유저정보 가져오기
        Users user = usersRepository.findByUserId(userId);

        if (user != null){
            // 비밀번호 확인
            boolean isPwMatch = user.getPw().equals(pw);
            if(isPwMatch){
                return user;
            }
        }
        return null;
    }


    @Transactional
    // 회원가입
    public Users signup(UserDTO sDto){
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

    // 비밀번호 확인
    public boolean verifyPassword(UserDTO dto){
        return usersRepository.existsByUserIdAndPw(dto.getUserId(), dto.getPw());
    }

    // 회원정보 수정
    public Users updateUser(UserDTO userDTO){
        Users user = new Users();
        user.setId(userDTO.getId());
        user.setUserId(userDTO.getUserId());
        user.setPw(userDTO.getPw());
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        user.setEmail(userDTO.getEmail());
        user.setJoinedAt(userDTO.getJoinedAt());
        user.setPreferredStyle(userDTO.getPreferredStyle());

        return usersRepository.save(user);
    }

}
