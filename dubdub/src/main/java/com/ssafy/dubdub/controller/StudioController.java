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

    @Operation(summary = "스튜디오 입장하기")
    @PostMapping
    public ResponseEntity<StudioEnterResponseDto> createStudio(@PathVariable("pid") Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Member member = SecurityUtil.getCurrentUser();

        StudioEnterResponseDto responseDto = studioService.createStudio(member, projectId);

        return ResponseEntity.ok(responseDto);
    }

    @Operation(summary = "작업정보 저장", description = "프로젝트의 작업정보를 저장합니다.")
    @PostMapping("/{pId}/workspace")
    public ResponseEntity<?> saveWorkspaceData(@PathVariable("pId") Long projectId,
            @RequestBody String workspaceData) {

        Member member = SecurityUtil.getCurrentUser();
        studioService.saveWorkspaceData(projectId, workspaceData, member);
        return ResponseEntity.ok().build();
    }
}