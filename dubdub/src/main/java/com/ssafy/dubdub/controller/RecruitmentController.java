package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.service.RecruitmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RequestMapping("/recruitment")
@RestController
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @Operation(summary = "모집글 작성")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addRecruitment(
            @RequestPart(value = "requestDTO", required = true) RecruitmentCreateRequestDTO requestDTO,
            @RequestPart(value = "video", required = true) MultipartFile video
    ) throws Exception {
        System.out.println("ㅗhi");

        recruitmentService.addRecruitment(requestDTO, video);
        return ResponseEntity.ok().body(null);
    }
}
