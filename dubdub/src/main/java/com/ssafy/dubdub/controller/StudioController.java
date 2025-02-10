package com.ssafy.dubdub.controller;


import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.service.StudioService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/project")
public class StudioController {

    private final StudioService studioService;

    @Operation(summary = "[방장] 스튜디오 만들기")
    @PostMapping("/{pid}/studio")
    public ResponseEntity<StudioEnterResponseDto> createStudio(@PathVariable("pid") Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Member member = SecurityUtil.getCurrentUser();

        StudioEnterResponseDto responseDto = studioService.createStudio(member, projectId);

        return ResponseEntity.ok(responseDto);
    }

    @Operation(summary = "스튜디오 입장하기")
    @GetMapping("/{pid}/studio")
    public ResponseEntity<StudioEnterResponseDto> enterStudio(@PathVariable("pid") Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {

        StudioEnterResponseDto responseDto = studioService.enterStudio(projectId);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/{sId}/save")
    public ResponseEntity<?> saveStudioState(@PathVariable("sId") Long studioId,
            @RequestBody String workspaceData) {

        Member member = SecurityUtil.getCurrentUser();
        studioService.saveWorkspaceData(studioId, workspaceData, member);
        return ResponseEntity.ok().build();
    }
}