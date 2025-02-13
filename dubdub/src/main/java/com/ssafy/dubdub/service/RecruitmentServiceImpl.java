package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentListResponseDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.enums.CategoryType;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.enums.GenreType;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.exception.RecruitmentException;
import com.ssafy.dubdub.repository.*;
import com.ssafy.dubdub.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class RecruitmentServiceImpl implements RecruitmentService {
    private final RecruitmentRepository recruitmentRepository;
    private final FileRepository fileRepository;
    private final GenreRepository genreRepository;
    private final CategoryRepository categoryRepository;
    private final CastingRepository castingRepository;

    private final S3Service s3Service;

    @Transactional(readOnly = true)
    @Override
    public Long findRecruitment(Long recruitmentId) {
        return recruitmentRepository.findById(recruitmentId).orElseThrow(
                () -> new NoSuchElementException("요청하신 리소스를 찾을 수 없습니다.")
        ).getId();
    }

    @Override
    public Long addRecruitment(RecruitmentCreateRequestDTO requestDTO, MultipartFile video, MultipartFile thumbnail, Member author) throws BadRequestException {
        if (!FileUtil.isValidVideoFile(video)) {
            log.debug("Invalid video file");
            throw new BadRequestException("비디오를 업로드해주세요.");
        } else if (!FileUtil.isValidImageFile(thumbnail)) {
            log.debug("Invalid thumbnail file");
            throw new BadRequestException("이미지를 업로드해주세요.");
        }

        Recruitment recruitment = Recruitment.builder()
                .author(author)
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .script(requestDTO.getScript())
                .build();

        String videoPath = FileUtil.generateFilePath(author.getEmail(), FileType.ORIGINAL_VIDEO);
        String thumbnailPath = FileUtil.generateFilePath(author.getEmail(), FileType.ORIGINAL_VIDEO);

        String videoUrl = s3Service.uploadFile(video, videoPath);
        String thumbnailUrl = s3Service.uploadFile(thumbnail, thumbnailPath);

        File videoFile = File.builder()
                .url(videoUrl)
                .recruitment(recruitment)
                .fileType(FileType.ORIGINAL_VIDEO)
                .build();

        File thumbnailFile = File.builder()
                .url(thumbnailUrl)
                .recruitment(recruitment)
                .fileType(FileType.THUMBNAIL)
                .build();

        requestDTO.getCastings().forEach(roleName -> recruitment.addCasting(new Casting(recruitment, roleName)));

        List<Genre> genres = genreRepository.findByGenreNameIn(requestDTO.getGenreTypes());
        genres.forEach(genre -> recruitment.addGenre(new RecruitmentGenre(recruitment, genre)));

        List<Category> categories = categoryRepository.findByCategoryNameIn(requestDTO.getGenreTypes());
        categories.forEach(category -> recruitment.addCategory(new RecruitmentCategory(recruitment, category)));

        fileRepository.save(videoFile);
        fileRepository.save(thumbnailFile);
        return recruitmentRepository.save(recruitment).getId();
    }

    @Override
    public Page<RecruitmentListResponseDTO> getRecruitments(RecruitmentSearchRequestDTO condition, Member member) {
        Page<Recruitment> recruitments = recruitmentRepository.findBySearchCondition(condition, member);
        return recruitments.map(this::convertToDTO);
    }

    @Override
    public void assignCasting(Long recruitmentId, Long castingId, Member member) {
        Casting casting = castingRepository.findByIdAndRecruitmentId(castingId, recruitmentId)
                .orElseThrow(() -> new RecruitmentException(ErrorCode.CASTING_NOT_FOUND));

        if (casting.getMemberId() != null) {
            throw new RecruitmentException(ErrorCode.CASTING_ALREADY_ASSIGNED);
        }

        casting.castMember(member.getId());
    }

    private RecruitmentListResponseDTO convertToDTO(Recruitment recruitment) {
        return RecruitmentListResponseDTO.builder()
                .id(recruitment.getId())
                .title(recruitment.getTitle())
                .currentParticipants((int) recruitment.getCastings().stream()
                        .filter(c -> c.getMemberId() != null)
                        .count())
                .totalParticipants(recruitment.getCastings().size())
                .genres(recruitment.getGenres().stream()
                        .map(rg -> rg.getGenre().getId())
                        .collect(Collectors.toList()))
                .categories(recruitment.getCategories().stream()
                        .map(rc -> rc.getCategory().getId())
                        .collect(Collectors.toList()))
                .build();
    }
}
