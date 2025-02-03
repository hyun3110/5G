package com.coordi.fiveG.controller;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDTO {

    private Long id;
    private String userId;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private LocalDateTime joinedAt;
    private String preferredStyle;

}