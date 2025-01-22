package com.coordi.fiveG.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupDto {

    private String userId;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private String preferredStyle;

}
