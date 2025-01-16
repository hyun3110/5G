package com.coordi.fiveG.service;

import com.coordi.fiveG.model.User;
import com.coordi.fiveG.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean login(String userid, String password) {
        User user = userRepository.findByUserid(userid);  // 사용자 정보 조회
        return user != null && password.equals(user.getPassword());  // 비밀번호 비교
    }
}
