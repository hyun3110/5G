package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Users findByUserId(String userId);

}
