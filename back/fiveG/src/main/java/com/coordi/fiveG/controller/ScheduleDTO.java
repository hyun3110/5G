package com.coordi.fiveG.controller;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ScheduleDTO {

    private Integer scheIdx;
    private Long userId;
    private String scheTitle;
    private String scheContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String scheType;
    private String weather;
    private String color;

}
