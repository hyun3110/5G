package com.coordi.fiveG.controller;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ClosetUploadRequestDTO {

    private MultipartFile file;
    private Long userId;
    private String category;

}
