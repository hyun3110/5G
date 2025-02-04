package com.coordi.fiveG.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CLOSETS")
public class Closets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CLOSET_IDX")
    private Integer closetIdx;

    @Column(name = "ID")
    private Long userId;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "FILE")
    private String file;

    @Column(name = "UPLOADED_AT")
    @CreationTimestamp
    private LocalDateTime uploadedAt;

}
