package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.domain.dto.MemberProfileResponseDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.service.MemberService;
import com.ssafy.dubdub.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "프로필 조회", description = "회원의 프로필을 조회합니다.")
    @GetMapping("/profile")
    public ResponseEntity<MemberProfileResponseDTO> checkProfile(
            @RequestParam(required = false) Long memberId
    ) {
        MemberProfileResponseDTO response = null;
        if (memberId == null) {
            Member member = SecurityUtil.getCurrentUser();
            response = MemberProfileResponseDTO.from(member);
        } else {
            response = memberService.checkProfile(memberId);
        }

        return ResponseEntity.ok(response);
    }
}
