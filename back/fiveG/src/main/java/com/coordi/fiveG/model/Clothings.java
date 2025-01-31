package com.coordi.fiveG.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CLOTHINGS")
public class Clothings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CLOTHING_IDX")
    private Integer clothingIdx;

    @Column(name = "ID")
    private Long userId;

    @Column(name = "CLOTHING_URL")
    private String clothingUrl;

    @Column(name = "IMG_URL")
    private String imgUrl;

    @Column(name = "CATEGORY")
    private String category;

}
