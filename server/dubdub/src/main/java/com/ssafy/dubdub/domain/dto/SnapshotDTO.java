package com.ssafy.dubdub.domain.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ssafy.dubdub.domain.entity.Snapshot;
import com.ssafy.dubdub.util.JsonStringDeserializer;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SnapshotDTO {
    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    private final String tracks;

    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    private final String assets;

    public static SnapshotDTO from(Snapshot snapshot) {
        return new SnapshotDTO(
                snapshot.getTracks(),
                snapshot.getAssets()
        );
    }
}
