package com.ssafy.dubdub.wss.dto;

import lombok.Getter;

@Getter
public class UserSession {
    private String id;
    private String name;
    private String role;
    private String profileUrl;
}
