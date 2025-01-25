package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Schedules;
import com.coordi.fiveG.service.SchedulesService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final SchedulesService schedulesService;

    // 회원 id로 일정 조회
    @GetMapping("/{id}")
    public List<Schedules> getScheduleById(@PathVariable("id") Long id){
        return schedulesService.getScheduleById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSchedule(@RequestBody ScheduleDTO scheduleDTO, HttpSession session) {
        try {
            Schedules newSchedule = schedulesService.addSchedule(scheduleDTO, session);
            return ResponseEntity.ok(newSchedule);  // 정상적인 경우, 새로운 일정 반환
        } catch (Exception e) {
            e.printStackTrace();  // 에러 발생 시 서버 로그에 출력
            return ResponseEntity.status(500).body("일정 추가 실패: " + e.getMessage());  // 에러 메시지 반환
        }
    }
}
