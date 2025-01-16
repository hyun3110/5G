package com.coordi.fiveG.controller;

public class LoginRequest {

    private String userid;
    private String password;

    // 기본 생성자
    public LoginRequest() {
    }

    // Getters and Setters
    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
