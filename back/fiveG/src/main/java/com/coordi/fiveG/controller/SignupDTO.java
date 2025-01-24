package com.coordi.fiveG.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupDTO {

    private String userId;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private String preferredStyle;

}
