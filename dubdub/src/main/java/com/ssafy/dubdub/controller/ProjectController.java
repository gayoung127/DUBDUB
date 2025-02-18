package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.CreationResponseDto;
import com.ssafy.dubdub.domain.dto.ProjectCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.ProjectListResponseDTO;
import com.ssafy.dubdub.domain.dto.ProjectSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.service.ProjectService;
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
@RequestMapping("/project")
@RestController
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "프로젝트 작성")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreationResponseDto> addRecruitment(
            @RequestPart(value = "requestDTO") ProjectCreateRequestDTO requestDTO,
            @RequestPart(value = "video") MultipartFile video,
            @RequestPart(value = "thumbnail") MultipartFile thumbnail
    ) throws Exception {

        Member member = SecurityUtil.getCurrentUser();

        Long pid = projectService.addProject(requestDTO, video, thumbnail, member);

        return ResponseEntity.ok().body(new CreationResponseDto(pid, HttpStatusCode.CREATED));
    }

    @Operation(summary = "내 프로젝트 조회")
    @GetMapping("/list")
    public ResponseEntity<Page<ProjectListResponseDTO>> getRecruitments(
            @ModelAttribute ProjectSearchRequestDTO request
    ) {
        Member member = SecurityUtil.getCurrentUser();

        Page<ProjectListResponseDTO> response =
                projectService.getProjects(request, member);
        return ResponseEntity.ok(response);
    }
}
