package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.MemberProfileResponseDTO;
import org.springframework.web.multipart.MultipartFile;

public interface MemberService {
    String uploadKakaoProfileImage(String kakaoImageUrl, String email);

    MemberProfileResponseDTO checkProfile(Long memberId);
}
