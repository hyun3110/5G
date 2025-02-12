package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Coordisets;
import com.coordi.fiveG.service.CoordisetsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/coordisets")
public class CoordisetsController {

    private final CoordisetsService coordisetsService;

    // userId값으로 꺼내오기
    @PostMapping("/{id}")
    public List<Coordisets> getCoordisets(@PathVariable("id") Long userId){
        return coordisetsService.getCoordisets(userId);
    }

    // 즐겨찾기 추가
    @PutMapping("/update")
    public ResponseEntity<?> updateCoordiset(@RequestBody CoordisetsDTO dto){
        try {
            Coordisets updateCoordiset = coordisetsService.updateCoordiset(dto);
            return ResponseEntity.ok(updateCoordiset);  // 정상적인 경우, 새로운 일정 반환
        } catch (Exception e) {
            e.printStackTrace();  // 에러 발생 시 서버 로그에 출력
            return ResponseEntity.status(500).body("일정 추가 실패: " + e.getMessage());  // 에러 메시지 반환
        }
    }

    // 즐겨찾기 가져오기
    @PostMapping("/pick")
    public List<Coordisets> pickCoordiset(@RequestParam("userId") Long userId){
        return coordisetsService.getPickCoordisets(userId);
    }

}
