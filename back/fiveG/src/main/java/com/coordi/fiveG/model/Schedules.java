package com.coordi.fiveG.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SCHEDULES")
public class Schedules {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHE_IDX")
    private Integer scheIdx;

    @Column(name = "ID")
    private Long userId;

    @Column(name = "SCHE_TITLE")
    private String scheTitle;

    @Column(name = "SCHE_CONTENT")
    private String scheContent;

    @Column(name = "ST_DT")
    private LocalDate startDate;

    @Column(name = "ED_DT")
    private LocalDate endDate;

    @Column(name = "SCHE_TYPE")
    private String scheType;

    @Column(name = "WEATHER")
    private String weather;

    @Column(name = "COLOR")
    private String color;

}
