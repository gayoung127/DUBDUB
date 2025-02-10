package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.service.OpenViduService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/openvidu")
public class OpenViduController {

    private final OpenViduService openViduService;

    @Operation(summary = "[test] 스튜디오 생성하기")
    @PostMapping("/sessions")
    public ResponseEntity<Map<String, String>> createSession() throws Exception {
        Map<String, String> map = new HashMap<>();
        String sessionId = openViduService.createSession();
        map.put("sessionId", sessionId);
        return ResponseEntity.ok(map);
    }


    @Operation(summary = "[test] 스튜디오 입장하기")
    @PostMapping("/connections/{sessionId}")
    public ResponseEntity<Map<String, String>> createConnection(@PathVariable String sessionId) throws Exception {
        Map<String, String> map = new HashMap<>();

        String token = openViduService.createConnection(sessionId);

        map.put("token", token);
        return ResponseEntity.ok().body(map);
    }
}