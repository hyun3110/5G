package com.coordi.fiveG.controller;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ScheduleDTO {

    private Integer scheId;
    private String scheTitle;
    private String scheType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String scheContent;
    private String color;

}
