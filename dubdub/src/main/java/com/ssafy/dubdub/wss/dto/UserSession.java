package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserSession {
    private final String id;
    private final String name;
    private final String role;
    private final String profileUrl;
}
