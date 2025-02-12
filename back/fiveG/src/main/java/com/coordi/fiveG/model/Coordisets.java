package com.coordi.fiveG.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "COORDISETS")
public class Coordisets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COORDI_IDX")
    private Integer idx;

    @Column(name = "IMG_URL")
    private String img;

    @Column(name = "STYLE")
    private String style;

    @Column(name = "SCHE_IDX")
    private Integer scheIdx;

    @Column(name = "ID")
    private Long userId;

    @Column(name = "PICK_YN")
    private boolean pick;

}
