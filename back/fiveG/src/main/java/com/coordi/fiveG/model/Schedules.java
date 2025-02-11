package com.coordi.fiveG.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;

    @Column(name = "ED_DT")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;

    @Column(name = "SCHE_TYPE")
    private String scheType;

    @Column(name = "WEATHER")
    private String feelsLike;

    @Column(name = "COLOR")
    private String color;

    @Column(name = "LAT")
    private String lat;

    @Column(name = "LON")
    private String lon;

}
