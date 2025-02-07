package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.service.OpenViduService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/openvidu")
public class OpenViduController {

    private final OpenViduService openViduService;

    @PostMapping("/sessions")
    public String createSession() throws Exception {
        return openViduService.createSession();
    }


    @Operation(summary = "[test] 스튜디오 입장하기")
    @PostMapping("/connections/{sessionId}")
    public String createConnection(@PathVariable String sessionId) throws Exception {
        return openViduService.createConnection(sessionId);
    }
}