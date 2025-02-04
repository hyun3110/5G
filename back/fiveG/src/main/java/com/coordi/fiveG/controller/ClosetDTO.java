package com.coordi.fiveG.controller;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ClosetDTO {

    private Integer closetIdx;
    private Long userId;
    private String category;
    private String file;
    private LocalDateTime uploadedAt;

}
