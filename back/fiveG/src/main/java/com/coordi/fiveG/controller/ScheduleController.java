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

    // 일정 추가
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

    // 일정 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable("id") Integer id, @RequestBody ScheduleDTO scheduleDTO) {
        try {
            Schedules updateSchedule = schedulesService.updateSchedule(id, scheduleDTO);
            return ResponseEntity.ok(updateSchedule);  // 정상적인 경우, 새로운 일정 반환
        } catch (Exception e) {
            e.printStackTrace();  // 에러 발생 시 서버 로그에 출력
            return ResponseEntity.status(500).body("일정 추가 실패: " + e.getMessage());  // 에러 메시지 반환
        }
    }

    // 일정 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable("id") Integer id) {
        Schedules schedule = schedulesService.getScheduleById(id);
        if (schedule == null) {
            return ResponseEntity.status(404).body("일정을 찾을 수 없습니다.");
        }

        schedulesService.deleteSchedule(id);
        return ResponseEntity.ok("일정이 성공적으로 삭제되었습니다.");
    }

}
