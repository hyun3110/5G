package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Closets;
import com.coordi.fiveG.service.ClosetsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/closets")
public class ClosetsController {

    private final ClosetsService closetsService;

    // 업로드 디렉토리 경로를 설정
    @Value("${upload.path}")
    private String uploadDirectory;

    @GetMapping("/{id}")
    public ResponseEntity<?> getClosets(@PathVariable("id") Long id){
        try {
            List<Closets> getClosets = closetsService.getClosets(id);
            return ResponseEntity.ok(getClosets);
        } catch (Exception e) {
            e.printStackTrace();  // 에러 발생 시 서버 로그에 출력
            return ResponseEntity.status(500).body("실패: " + e.getMessage());  // 에러 메시지 반환
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("category") String category) {

        try {
            // ClosetUploadRequestDTO 객체를 생성하여 데이터 설정
            ClosetUploadRequestDTO requestDTO = new ClosetUploadRequestDTO();
            requestDTO.setFile(file);
            requestDTO.setUserId(userId);
            requestDTO.setCategory(category);

            // 서비스에서 파일 업로드 및 데이터 저장 처리
            ClosetDTO closetDTO = closetsService.uploadFile(requestDTO);

            if (closetDTO == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(closetDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/download/{file}")
    @ResponseBody
    public ResponseEntity<byte[]> downloadFile(@PathVariable("file") String filename) {
        try {
            Path filePath = Paths.get(uploadDirectory, filename);
            byte[] fileContent = Files.readAllBytes(filePath);

            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")  // 이미지 타입에 맞게 설정
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}
