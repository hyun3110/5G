package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Schedules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchedulesRepository extends JpaRepository<Schedules, Integer> {

    // 회원 id번호로 일정 가져오기
    List<Schedules> findById(Long id);
}
