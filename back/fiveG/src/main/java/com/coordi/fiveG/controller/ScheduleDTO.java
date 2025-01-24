package com.coordi.fiveG.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {

    private String scheTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String scheContent;

}
