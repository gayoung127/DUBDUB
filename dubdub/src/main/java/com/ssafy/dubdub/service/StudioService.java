package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.File;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.repository.*;
import io.openvidu.java.client.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudioService {

    private final OpenViduService openViduService;
    private final RecruitmentRepository recruitmentRepository;
    private final StudioRepository studioRepository;
    private final FileRepository fileRepository;
    private final CastingRepository castingRepository;

    public StudioEnterResponseDto createStudio(Member member, Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Recruitment project = recruitmentRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        List<String> roleList = castingRepository.findRoleNameListByRecruitmentId(projectId);

        Optional<File> video = fileRepository.findByRecruitmentIdAndFileType(projectId, FileType.ORIGINAL_VIDEO);
        String videoUrl = video.map(File::getUrl).orElse(null);

        Studio studio = studioRepository.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId)
                .orElseGet(() -> {
                    try {
                        Studio newStudio = new Studio(project, openViduService.createSession());
                        return studioRepository.save(newStudio);
                    } catch (OpenViduJavaClientException | OpenViduHttpException e) {
                        throw new RuntimeException("OpenVidu 세션 생성 중 오류 발생", e);
                    }
                });

        String token = openViduService.createConnection(studio.getSession());

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .videoUrl(videoUrl)
                .roleList(roleList)
                .token(token)
                .session(studio.getSession())
                .snapshot(null)
                .build();
    }

    public void saveWorkspaceData(Long studioId, String workspaceData, Member member) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new EntityNotFoundException("스튜디오를 찾을 수 없습니다."));

        Recruitment recruitment = studio.getRecruitment();
        recruitment.updateWorkspaceData(workspaceData);
    }
}
