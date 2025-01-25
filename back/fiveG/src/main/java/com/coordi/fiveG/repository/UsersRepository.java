package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    Users findByUserId(String userId);

    // 아이디 중복 확인
    boolean existsByUserId(String userId);

}
