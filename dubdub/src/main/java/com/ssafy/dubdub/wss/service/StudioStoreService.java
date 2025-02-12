package com.ssafy.dubdub.wss.service;

import com.ssafy.dubdub.wss.dto.AudioAsset;
import com.ssafy.dubdub.wss.dto.TrackFile;
import com.ssafy.dubdub.wss.dto.TrackRecorder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public interface StudioStoreService {
    List<AudioAsset> getAssetList(String sessionId);
    AudioAsset saveAsset(String sessionId, AudioAsset audioAsset);
    void deleteAsset(String sessionId, String assetId);

    List<TrackRecorder> getTrackRecorderList(String sessionId);
    TrackRecorder saveTrackRecorder(String sessionId, TrackRecorder trackRecorder);
    void deleteTrackRecorder(String sessionId, String trackRecorderId);

    List<TrackFile> getTrackFileList(String sessionId);
    TrackFile saveTrackFile(String sessionId, TrackFile trackFile);
    void deleteTrackFile(String sessionId, String trackFileId);
}
