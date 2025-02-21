package com.ssafy.dubdub.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum GenreType {
    ACTION(1, "액션"),
    COMEDY(2, "코믹"),
    THRILLER(3, "스릴러"),
    HORROR(4, "공포"),
    ROMANCE(5, "로맨스"),
    SF(6, "SF"),
    FANTASY(7, "판타지"),
    LIFE(8, "일상"),
    ETC(9, "기타");

    private final int id;
    private final String label; // 한글 지원 필드

    GenreType(int id, String label) {
        this.id = id;
        this.label = label;
    }

    // JSON 직렬화 시 한글(label) 반환
    @JsonValue
    public String getLabel() {
        return label;
    }

    // JSON 역직렬화 시 한글 or 영어 지원
    @JsonCreator
    public static GenreType fromValue(String value) {
        for (GenreType type : values()) {
            if (type.getLabel().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid GenreType value: " + value);
    }
}