package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.FileUploadResponseDTO;
import com.ssafy.dubdub.domain.dto.SnapshotDTO;
import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.domain.entity.Project;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.exception.BaseException;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.repository.*;
import com.ssafy.dubdub.util.FileUtil;
import io.openvidu.java.client.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudioService {

    private final OpenViduService openViduService;
    private final S3Service s3Service;
    private final ProjectRepository projectRepository;
    private final StudioRepository studioRepository;
    private final FileRepository fileRepository;
    private final CastingRepository castingRepository;
    private final SnapshotRepository snapshotRepository;
    private final ParticipationHistoryRepository participationHistoryRepository;

    public StudioEnterResponseDto createStudio(Member member, Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        List<String> roleList = castingRepository.findRoleNameListByRecruitmentId(projectId);

        Optional<File> video = fileRepository.findByProjectIdAndFileType(projectId, FileType.ORIGINAL_VIDEO);
        String videoUrl = video.map(File::getUrl).orElse(null);

        Optional<File> thumbnail = fileRepository.findByProjectIdAndFileType(projectId, FileType.THUMBNAIL);
        String thumbnailUrl = thumbnail.map(File::getUrl).orElse(null);

        Studio studio = studioRepository.findFirstByProjectIdAndIsClosedIsFalse(projectId)
                .orElseGet(() -> {
                    try {
                        Studio newStudio = new Studio(project, openViduService.createSession());
                        return studioRepository.save(newStudio);
                    } catch (OpenViduJavaClientException | OpenViduHttpException e) {
                        throw new RuntimeException("OpenVidu 세션 생성 중 오류 발생", e);
                    }
                });

        String token = openViduService.createConnection(studio.getSession());

        SnapshotDTO snapshot = snapshotRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId)
                .map(SnapshotDTO::from)
                .orElse(null);

        ParticipationHistory participationHistory = new ParticipationHistory(member, project);
        participationHistoryRepository.save(participationHistory);

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .videoUrl(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .roleList(roleList)
                .token(token)
                .session(studio.getSession())
                .snapshot(snapshot)
                .build();
    }

    public void saveWorkspaceData(Long projectId, SnapshotDTO requestDto, Member member) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("해당 프로젝트를 찾을 수 없습니다."));

        validateAuthorization(project, member);

        try {
            Snapshot newVersion = Snapshot.builder()
                    .project(project)
                    .assets(requestDto.getAssets())
                    .tracks(requestDto.getTracks())
                    .build();

            snapshotRepository.save(newVersion);
        } catch (Exception e) {
            throw new RuntimeException("작업 내용 저장에 실패했습니다.", e);
        }
    }

    private void validateAuthorization(Project project, Member currentUser) {
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("작업정보 접근 권한이 없습니다.");
        }
    }

    public FileUploadResponseDTO uploadAudioAsset(Member member, Long projectId, MultipartFile asset) {
        if (!FileUtil.isValidAudioFile(asset)) {
            throw new BaseException(ErrorCode.INVALID_AUDIO_FORMAT);
        }
        String filePath = FileUtil.generateFilePath(member.getEmail(), FileType.AUDIO);
        String url = s3Service.uploadFile(asset, filePath);

        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다.")
        );

        File file = File.builder()
                .url(url)
                .project(project)
                .fileType(FileType.AUDIO)
                .build();

        fileRepository.save(file);

        return new FileUploadResponseDTO(url, project.getId());
    }

    public void closeStudioIfEmpty(String session) {
        studioRepository.findBySession(session)
                .ifPresent(studio -> {
                    if (!studio.isClosed()) {
                        studio.close();
                    }
                });
    }
}
