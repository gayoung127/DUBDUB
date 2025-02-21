package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.domain.dto.FileUploadResponseDTO;
import com.ssafy.dubdub.domain.dto.SnapshotDTO;
import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.repository.SnapshotRepository;
import com.ssafy.dubdub.service.StudioService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/project")
public class StudioController {

    private final StudioService studioService;
    private final SnapshotRepository snapshotRepository;

    @Operation(summary = "스튜디오 입장하기")
    @PostMapping("/{pid}/enter-studio")
    public ResponseEntity<StudioEnterResponseDto> createStudio(@PathVariable("pid") Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {

        Member member = SecurityUtil.getCurrentUser();

        StudioEnterResponseDto responseDto = studioService.createStudio(member, projectId);

        return ResponseEntity.ok(responseDto);
    }

    @Operation(summary = "작업 내역 저장", description = "프로젝트의 작업 내역을 저장합니다.")
    @PostMapping("/{pid}/save-snapshot")
    public ResponseEntity<?> saveWorkspaceData(@PathVariable("pid") Long projectId,
                                               @RequestBody SnapshotDTO requestDto) {

        Member member = SecurityUtil.getCurrentUser();

        studioService.saveWorkspaceData(projectId, requestDto, member);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "스튜디오 오디오 에셋 업로드")
    @PostMapping(path = "/{pid}/asset", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FileUploadResponseDTO> saveAsset(@PathVariable("pid") Long projectId,
                                                           @RequestPart MultipartFile file) {

        Member member = SecurityUtil.getCurrentUser();

        FileUploadResponseDTO responseDto = studioService.uploadAudioAsset(member, projectId, file);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(summary = "[TEMP] 스튜디오 닫기")
    @PostMapping(path = "/studio/{session-id}/close")
    public ResponseEntity<?> closeStudio(@PathVariable("session-id") String sessionId) {
        Map<String, Boolean> map = new HashMap<>();

        studioService.closeStudioIfEmpty(sessionId);

        map.put("result", true);
        return ResponseEntity.ok().body(map);
    }
}