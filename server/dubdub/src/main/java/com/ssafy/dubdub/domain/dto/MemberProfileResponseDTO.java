package com.ssafy.dubdub.domain.dto;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.enums.Position;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class MemberProfileResponseDTO {
    @Schema(description = "멤버 식별 id", example = "1")
    private final Long memberId;

    @Schema(description = "멤버 email", example = "example@example.com")
    private final String email;

    @Schema(description = "멤버 닉네임", example = "아꼽지")
    private final String nickName;

    @Schema(description = "멤버 역할", example = "PRO")
    private final Position position;

    @Schema(description = "멤버 프로필 url", example = "s3업로드 된 주소")
    private final String profileUrl;

    private MemberProfileResponseDTO(Long memberId, String email, String nickName, Position position, String profileUrl) {
        this.memberId = memberId;
        this.email = email;
        this.nickName = nickName;
        this.position = position;
        this.profileUrl = profileUrl;
    }

    public static MemberProfileResponseDTO from(Member member) {
        return new MemberProfileResponseDTO(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getPosition(),
                member.getProfileUrl()
        );
    }
}
