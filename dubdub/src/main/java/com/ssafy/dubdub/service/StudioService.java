package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.exception.AuthException;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.repository.RecruitmentRepository;
import com.ssafy.dubdub.repository.StudioReposiotry;
import io.openvidu.java.client.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class StudioService {

    private final OpenViduService openViduService;
    private final RecruitmentRepository recruitmentRepository;
    private final StudioReposiotry studioReposiotry;

    public StudioEnterResponseDto createStudio(Member member, Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {

        Recruitment project = recruitmentRepository.findByIdAndAuthorId(projectId, member.getId()).orElseThrow(
                () -> new AuthException(ErrorCode.UNAUTHORIZED_ACCESS)
        );

        Studio studio = studioReposiotry.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId).orElse(
            new Studio(project, openViduService.createSession())
        );

        String token = openViduService.createConnection(studio.getSession());

        studioReposiotry.save(studio);

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .token(token)
                .session(studio.getSession())
                .script(null)
                .build();
    }

    public StudioEnterResponseDto enterStudio(Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Recruitment project = recruitmentRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        Studio studio = studioReposiotry.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId).orElseThrow(
                () -> new NoSuchElementException("현재 참가할 수 있는 스튜디오 세션이 존재하지 않습니다.")
        );

        String token = openViduService.createConnection(studio.getSession());

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .token(token)
                .session(studio.getSession())
                .script(null)
                .build();
    }
}
