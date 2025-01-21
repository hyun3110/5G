package com.coordi.fiveG.service;

import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    public boolean login(String userId, String pw){
        Users user = usersRepository.findByUserId(userId);
        if (user != null && user.getPw().equals(pw)) {
            return true;
        }
        return false;
    }

}
