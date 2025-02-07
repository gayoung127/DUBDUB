package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.service.OpenViduService;
import com.ssafy.dubdub.service.StudioService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/recruitment/{rid}/studio")
public class StudioController {

    private final StudioService studioService;

    @Operation(summary = "[방장] 스튜디오 만들기")
    @PostMapping
    public ResponseEntity<?> createStudio(@PathVariable("rid") String rid) {
        Member member = SecurityUtil.getCurrentUser();

        studioService.createStudio();

        return ResponseEntity.ok().build();
    }
}