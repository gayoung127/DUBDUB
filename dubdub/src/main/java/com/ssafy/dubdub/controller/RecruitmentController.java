package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentListResponseDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.service.RecruitmentService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
        if (requestDTO == null) {
            return ResponseEntity.badRequest().body("requestDTO가 필요합니다.");
        }

        if (video == null || video.isEmpty()) {
            return ResponseEntity.badRequest().body("비디오 파일이 필요합니다.");
        }

        Member member = SecurityUtil.getCurrentUser();
        recruitmentService.addRecruitment(requestDTO, video, member);
        return ResponseEntity.ok().body("업로드 성공");
    }

    @Operation(summary = "내 프로젝트 조회")
    @GetMapping("/list")
    public ResponseEntity<Page<RecruitmentListResponseDTO>> getRecruitments(
            @ModelAttribute RecruitmentSearchRequestDTO request
    ) {
        Member member = SecurityUtil.getCurrentUser();

        Page<RecruitmentListResponseDTO> response =
                recruitmentService.getRecruitments(request, member);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "모집글 역할 배정")
    @PostMapping("/{recruitmentId}/{castingId}")
    public ResponseEntity<?> assignCasting(@PathVariable Long recruitmentId, @PathVariable Long castingId){
        Member member = SecurityUtil.getCurrentUser();

        recruitmentService.assignCasting(recruitmentId, castingId, member);
        return ResponseEntity.ok().build();
    }
}
