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
@Table(name = "USERS")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "PW")
    private String pw;

    @Column(name = "NAME")
    private String name;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "JOINED_AT")
    @CreationTimestamp
    private LocalDateTime joinedAt;

    @Column(name = "RESIDENTREGNUM")
    private String residentNum;

    @Column(name = "CASUAL")
    private boolean casual;

    @Column(name = "CHIC")
    private boolean chic;

    @Column(name = "CLASSIC")
    private boolean classic;

    @Column(name = "MINIMAL")
    private boolean minimal;

    @Column(name = "STREET")
    private boolean street;

    @Column(name = "SPORTY")
    private boolean sporty;

}
