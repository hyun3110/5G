package com.coordi.fiveG.service;

import com.coordi.fiveG.controller.ScheduleDTO;
import com.coordi.fiveG.model.Schedules;
import com.coordi.fiveG.model.Users;
import com.coordi.fiveG.repository.SchedulesRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
@Service
public class SchedulesService {

    private final SchedulesRepository schedulesRepository;

    // 회원 id로 일정 가져오기
    public List<Schedules> getScheduleById(Long id){
        return schedulesRepository.findById(id);
    }

    // 일정 추가
    public Schedules addSchedule(ScheduleDTO scheduleDTO, HttpSession session) {
        // 회원 id값 가져오기
        Users user = (Users) session.getAttribute("user");
        if(user == null) {
            throw new RuntimeException("세션이 만료되었습니다. 다시 로그인해주세요.");
        }

        // startDate와 endDate가 LocalDate라면 바로 사용 가능
        LocalDate startDate = scheduleDTO.getStartDate();
        LocalDate endDate = scheduleDTO.getEndDate();

        // DTO에서 데이터를 꺼내와서 새로운 Schedule 엔티티 객체를 만듬
        Schedules schedule = new Schedules();
        schedule.setId(user.getId());
        schedule.setScheTitle(scheduleDTO.getScheTitle());
        schedule.setStartDate(startDate);
        schedule.setEndDate(endDate);
        schedule.setScheContent(scheduleDTO.getScheContent());

        // DB에 저장
        return schedulesRepository.save(schedule);
    }


}
