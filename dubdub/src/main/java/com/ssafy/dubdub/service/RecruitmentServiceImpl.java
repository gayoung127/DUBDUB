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
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class RecruitmentServiceImpl implements RecruitmentService{
    private final RecruitmentRepository recruitmentRepository;
    private final FileRepository fileRepository;
    private final GenreRepository genreRepository;
    private final CategoryRepository categoryRepository;
    private final CastingRepository castingRepository;
    private final MemberRepository memberRepository;
    private final StudioRepository studioRepository;

    private final S3Service s3Service;

    @Transactional(readOnly = true)
    @Override
    public Long findRecruitment(Long recruitmentId) {
        return recruitmentRepository.findById(recruitmentId).orElseThrow(
                () -> new NoSuchElementException("요청하신 리소스를 찾을 수 없습니다.")
        ).getId();
    }

    @Override
    public Long addRecruitment(RecruitmentCreateRequestDTO requestDTO, MultipartFile video, Member author) throws BadRequestException {
        if(!FileUtil.isValidVideoFile(video)) {
            log.debug("Invalid video file");
            throw new BadRequestException("비디오를 업로드해주세요.");
        }

        Recruitment recruitment = Recruitment.builder()
                .author(author)
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .script(requestDTO.getScript())
                .build();

        String filePath = FileUtil.generateFilePath(author.getEmail(), FileType.ORIGINAL_VIDEO);
        String fileUrl = s3Service.uploadFile(video, filePath);

        File file = File.builder()
                .url(fileUrl)
                .recruitment(recruitment)
                .fileType(FileType.ORIGINAL_VIDEO)
                .build();

        for(String roleName: requestDTO.getCastings()) {
            recruitment.addCasting(new Casting(recruitment, roleName));
        }

        for (GenreType genreType : requestDTO.getGenreTypes()) {
            Genre genre = genreRepository.findByGenreName(genreType) // 장르 조회
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장르: " + genreType));

            RecruitmentGenre recruitmentGenre = new RecruitmentGenre(recruitment, genre);
            recruitment.addGenre(recruitmentGenre);
        }

        for (CategoryType categoryType : requestDTO.getCategoryTypes()) {
            Category category = categoryRepository.findByCategoryName(categoryType)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리유형: " + categoryType));

            RecruitmentCategory recruitmentCategory = new RecruitmentCategory(recruitment, category);
            recruitment.addCategory(recruitmentCategory);
        }

        fileRepository.save(file);
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

    @Override
    public void tempAssignCasting(Long recruitmentId, Long castingId) {
        Casting casting = castingRepository.findByIdAndRecruitmentId(castingId, recruitmentId)
                .orElseThrow(() -> new RecruitmentException(ErrorCode.CASTING_NOT_FOUND));

        if (casting.getMemberId() != null) {
            throw new RecruitmentException(ErrorCode.CASTING_ALREADY_ASSIGNED);
        }

        casting.castMember(1L);
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
