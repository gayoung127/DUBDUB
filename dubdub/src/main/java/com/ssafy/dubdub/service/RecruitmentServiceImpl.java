package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.enums.CategoryType;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.enums.GenreType;
import com.ssafy.dubdub.repository.CategoryRepository;
import com.ssafy.dubdub.repository.FileRepository;
import com.ssafy.dubdub.repository.GenreRepository;
import com.ssafy.dubdub.repository.RecruitmentRepository;
import com.ssafy.dubdub.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.NoSuchElementException;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class RecruitmentServiceImpl implements RecruitmentService{
    private final RecruitmentRepository recruitmentRepository;
    private final FileRepository fileRepository;
    private final GenreRepository genreRepository;
    private final CategoryRepository categoryRepository;

    private final S3Service s3Service;

    @Transactional(readOnly = true)
    @Override
    public Long findRecruitment(Long recruitmentId) {
        return recruitmentRepository.findById(recruitmentId).orElseThrow(
                () -> {return new NoSuchElementException("");}
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
                .startTime(requestDTO.getStartTime())
                .endTime(requestDTO.getEndTime())
                .isRecruiting(requestDTO.isPrivate())
                .build();

        String filePath = FileUtil.generateFilePath("test", FileType.ORIGINAL_VIDEO);
        String fileUrlurl = s3Service.uploadFile(video, filePath);

        File file = File.builder()
                .fileName(fileUrlurl)
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
}
