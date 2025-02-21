package com.ssafy.dubdub.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum CategoryType {
    MOVIE(1, "영화"),
    ANIMATION(2, "애니메이션"),
    DOCUMENTARY(3, "다큐멘터리"),
    DRAMA(4, "드라마"),
    COMMERCIAL(5, "광고/CF"),
    ETC(6, "기타");

    private final int id;
    private final String label;  // 한글 이름 저장

    CategoryType(int id, String label) {
        this.id = id;
        this.label = label;
    }

    // JSON 직렬화 시 한글(label) 반환
    @JsonValue
    public String getLabel() {
        return label;
    }

    // JSON 역직렬화 시 한글 -> Enum 매핑
    @JsonCreator
    public static CategoryType fromLabel(String label) {
        for (CategoryType type : values()) {
            if (type.getLabel().equals(label)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid CategoryType label: " + label);
    }
}
