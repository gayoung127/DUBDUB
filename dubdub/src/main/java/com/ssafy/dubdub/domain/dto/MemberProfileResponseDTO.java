package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.enums.Position;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberProfileResponseDTO {
    @Schema(description = "멤버 식별 id", example = "1")
    private Long memberId;

    @Schema(description = "멤버 email", example = "example@example.com")
    private String email;

    @Schema(description = "멤버 역할", example = "PRO")
    private Position position;

    @Schema(description = "멤버 프로필 url", example = "s3업로드 된 주소")
    private String profileUrl;

    public static MemberProfileResponseDTO from(Member member) {
        return MemberProfileResponseDTO.builder()
                .memberId(member.getId())
                .email(member.getEmail())
                .position(member.getPosition())
                .profileUrl(member.getProfileUrl())
                .build();
    }
}
