package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.domain.entity.WorkspaceData;
import com.ssafy.dubdub.repository.RecruitmentRepository;
import com.ssafy.dubdub.repository.StudioRepository;
import com.ssafy.dubdub.repository.WorkspaceDataRepository;
import io.openvidu.java.client.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class StudioService {

    private final OpenViduService openViduService;
    private final RecruitmentRepository recruitmentRepository;
    private final StudioRepository studioRepository;
    private final WorkspaceDataRepository workspaceDataRepository;

    public StudioEnterResponseDto createStudio(Member member, Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {

        Recruitment project = recruitmentRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        Studio studio = studioRepository.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId).orElse(
            new Studio(project, openViduService.createSession())
        );

        String token = openViduService.createConnection(studio.getSession());

        studioRepository.save(studio);

        String latestWorkspaceData = workspaceDataRepository.findLatestWorkspaceData(projectId)
                .map(WorkspaceData::getWorkspaceData)
                .orElse(null);

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .token(token)
                .session(studio.getSession())
                .workspaceData(latestWorkspaceData)
                .build();
    }

    public StudioEnterResponseDto enterStudio(Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Recruitment project = recruitmentRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        Studio studio = studioRepository.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId).orElseThrow(
                () -> new NoSuchElementException("현재 참가할 수 있는 스튜디오 세션이 존재하지 않습니다.")
        );

        String token = openViduService.createConnection(studio.getSession());

        String latestWorkspaceData = workspaceDataRepository.findLatestWorkspaceData(projectId)
                .map(WorkspaceData::getWorkspaceData)
                .orElse(null);

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .token(token)
                .session(studio.getSession())
                .workspaceData(latestWorkspaceData)
                .build();
    }

    @Transactional
    public void saveWorkspaceData(Long studioId, String workspaceData, Member member) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new EntityNotFoundException("스튜디오를 찾을 수 없습니다."));

        Recruitment project = studio.getRecruitment();
        validateAuthorization(project, member);

        try {
            Integer latestVersion = workspaceDataRepository
                    .findLatestWorkspaceVersion(project.getId())
                    .orElse(0);

            WorkspaceData newVersion = WorkspaceData.builder()
                    .project(project)
                    .workspaceData(workspaceData)
                    .workspaceVersion(latestVersion + 1)
                    .build();

            workspaceDataRepository.save(newVersion);
        } catch (Exception e) {
            throw new RuntimeException("작업 내용 저장에 실패했습니다.", e);
        }
    }

    private void validateAuthorization(Recruitment project, Member currentUser) {
        if (!project.getAuthor().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("작업정보 접근 권한이 없습니다.");
        }
    }
}
