package com.ssafy.dubdub.member.service;

import com.ssafy.dubdub.auth.dto.KakaoUserDTO;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.member.entity.Enum.Provider;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.exception.MemberException;
import com.ssafy.dubdub.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

}
