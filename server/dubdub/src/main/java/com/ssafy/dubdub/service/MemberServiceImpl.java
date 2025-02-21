package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.DelegatingMultipartFile;
import com.ssafy.dubdub.domain.dto.MemberProfileResponseDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.enums.FileType;
import com.ssafy.dubdub.exception.ErrorCode;
import com.ssafy.dubdub.exception.MemberException;
import com.ssafy.dubdub.repository.MemberRepository;
import com.ssafy.dubdub.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    public String uploadKakaoProfileImage(String kakaoImageUrl, String email) {
        if (kakaoImageUrl == null || kakaoImageUrl.isBlank()) {
            return null;
        }
        try {
            URL url = new URL(kakaoImageUrl);
            URLConnection connection = url.openConnection();

            MultipartFile file = new DelegatingMultipartFile(
                    connection.getInputStream(),
                    "profile.jpg",
                    connection.getContentType()
            );

            if (!FileUtil.isValidImageFile(file)) {
                throw new MemberException(ErrorCode.INVALID_IMAGE_FORMAT);
            }

            String filePath = FileUtil.generateFilePath(email, FileType.PROFILE);

            return s3Service.uploadFile(file, filePath);
        } catch (IOException e) {
            throw new MemberException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public MemberProfileResponseDTO getProfile(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(ErrorCode.MEMBER_NOT_FOUND));

        return MemberProfileResponseDTO.from(member);
    }
}

