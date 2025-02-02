package com.ssafy.dubdub.service;

import org.springframework.web.multipart.MultipartFile;

public interface MemberService {
    String uploadKakaoProfileImage(String kakaoImageUrl, String email);
}
