package com.coordi.fiveG.service;

import com.coordi.fiveG.controller.ClosetDTO;
import com.coordi.fiveG.controller.ClosetUploadRequestDTO;
import com.coordi.fiveG.model.Closets;
import com.coordi.fiveG.repository.ClosetsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ClosetsService {

    private final ClosetsRepository closetsRepository;

    // 업로드 디렉토리 경로를 설정
    @Value("${upload.path}")
    private String uploadDirectory;

    // 옷장정보 불러오기
    public List<Closets> getClosets(Long id) {
        return closetsRepository.findByUserId(id);
    }

    // 옷장에 파일 업로드
    public ClosetDTO uploadFile(ClosetUploadRequestDTO requestDTO) throws IOException {
        MultipartFile file = requestDTO.getFile();
        Long userId = requestDTO.getUserId();
        String category = requestDTO.getCategory();

        // 파일 크기 제한 (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("파일 크기는 5MB 이하이어야 합니다.");
        }

        // 파일 저장 경로 설정
        File uploadDir = new File(uploadDirectory);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 파일 이름에 고유 식별자 추가 (UUID)
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new IllegalArgumentException("파일 이름이 유효하지 않습니다.");
        }

        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension; // 예: 123e4567-e89b-12d3-a456-426614174000.jpg

        // 파일 경로 지정
        Path filePath = Paths.get(uploadDirectory, uniqueFileName);

        // 파일 저장
        Files.write(filePath, file.getBytes());

        // Closet 데이터베이스에 저장
        Closets closet = new Closets();
        closet.setUserId(userId);
        closet.setCategory(category);
        closet.setFile(uniqueFileName);
        closet.setUploadedAt(LocalDateTime.now());

        Closets savedCloset = closetsRepository.save(closet);

        // DTO로 변환하여 반환
        return new ClosetDTO(
                savedCloset.getClosetIdx(),
                savedCloset.getUserId(),
                savedCloset.getCategory(),
                savedCloset.getFile(),
                savedCloset.getUploadedAt()
        );
    }
}
