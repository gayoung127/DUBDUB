package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.ProjectCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.ProjectListResponseDTO;
import com.ssafy.dubdub.domain.dto.ProjectSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.enums.ParticipationType;
import com.ssafy.dubdub.repository.*;
import com.ssafy.dubdub.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service()
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;
    private final CastingRepository castingRepository;

    private final S3Service s3Service;

    @Transactional(readOnly = true)
    @Override
    public Long findRecruitment(Long recruitmentId) {
        return projectRepository.findById(recruitmentId).orElseThrow(
                () -> new NoSuchElementException("요청하신 리소스를 찾을 수 없습니다.")
        ).getId();
    }

    @Override
    public Long addProject(ProjectCreateRequestDTO requestDTO, MultipartFile video, MultipartFile thumbnail, Member owner) throws BadRequestException {
        if (!FileUtil.isValidVideoFile(video)) {
            log.debug("Invalid video file");
            throw new BadRequestException("비디오를 업로드해주세요.");
        } else if (!FileUtil.isValidImageFile(thumbnail)) {
            log.debug("Invalid thumbnail file");
            throw new BadRequestException("이미지를 업로드해주세요.");
        }

        Project project = projectRepository.save(Project.builder()
                .owner(owner)
                .title(requestDTO.getTitle())
                .script(requestDTO.getScript())
                .build());

        String videoPath = FileUtil.generateFilePath(owner.getEmail(), FileType.ORIGINAL_VIDEO);
        String thumbnailPath = FileUtil.generateFilePath(owner.getEmail(), FileType.THUMBNAIL);

        String videoUrl = s3Service.uploadFile(video, videoPath);
        String thumbnailUrl = s3Service.uploadFile(thumbnail, thumbnailPath);

        File videoFile = File.builder()
                .url(videoUrl)
                .project(project)
                .fileType(FileType.ORIGINAL_VIDEO)
                .build();

        File thumbnailFile = File.builder()
                .url(thumbnailUrl)
                .project(project)
                .fileType(FileType.THUMBNAIL)
                .build();

        fileRepository.saveAll(List.of(videoFile, thumbnailFile));

        List<Casting> castings = requestDTO.getCastings().stream()
                .map(roleName -> new Casting(project, roleName))
                .collect(Collectors.toList());

        castingRepository.saveAll(castings);

        return project.getId();
    }

    @Override
    public Page<ProjectListResponseDTO> getProjects(ProjectSearchRequestDTO condition, Member member) {
        PageRequest pageRequest = PageRequest.of(
                condition.getPage(),
                condition.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        if (condition.getType() == ParticipationType.CREATED) {
            return projectRepository.findProjectsWithThumbnailByOwner(member, pageRequest);
        } else {
            return projectRepository.findProjectsWithThumbnailByParticipant(member, pageRequest);
        }
    }
}
