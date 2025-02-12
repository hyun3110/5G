package com.coordi.fiveG.controller;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CoordisetsDTO {

    private Integer idx;
    private String img;
    private String style;
    private Integer scheIdx;
    private Long userId;
    private boolean pick;
}
