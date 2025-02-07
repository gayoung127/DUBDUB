package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.service.StudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/openvidu")
public class StudioController {

    private final StudioService studioService;

    @PostMapping("/sessions")
    public String createSession() throws Exception {
        return studioService.createSession();
    }

    @PostMapping("/connections/{sessionId}")
    public String createConnection(@PathVariable String sessionId) throws Exception {
        return studioService.createConnection(sessionId);
    }
}