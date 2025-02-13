package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.CreationResponseDto;
import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentListResponseDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.service.RecruitmentService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.http.HttpStatusCode;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/recruitment")
@RestController
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @Operation(summary = "모집글 작성")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreationResponseDto> addRecruitment(
            @RequestPart(value = "requestDTO") RecruitmentCreateRequestDTO requestDTO,
            @RequestPart(value = "video") MultipartFile video,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
    ) throws Exception {

        Member member = SecurityUtil.getCurrentUser();
        Long pid = recruitmentService.addRecruitment(requestDTO, video, thumbnail, member);
        return ResponseEntity.ok().body(new CreationResponseDto(pid, HttpStatusCode.CREATED));
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
    public ResponseEntity<?> assignCasting(@PathVariable Long recruitmentId, @PathVariable Long castingId) {
        Member member = SecurityUtil.getCurrentUser();

        recruitmentService.assignCasting(recruitmentId, castingId, member);
        return ResponseEntity.ok().build();
    }
}
