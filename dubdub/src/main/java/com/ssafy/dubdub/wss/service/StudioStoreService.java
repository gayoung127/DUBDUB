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
    AudioAsset addAsset(String sessionId, AudioAsset audioAsset);
    void deleteAsset(String sessionId, String assetId);
    AudioAsset updateAsset(String sessionId, AudioAsset audioAsset);

    List<TrackRecorder> getTrackRecorderList(String sessionId);
    TrackRecorder addTrackRecorder(String sessionId, TrackRecorder trackRecorder);
    void deleteTrackRecorder(String sessionId, String trackRecorderId);
    TrackRecorder updateTrackRecorder(String sessionId, TrackRecorder trackRecorder);

    List<TrackFile> getTrackFileList(String sessionId);
    TrackFile addTrackFile(String sessionId, TrackFile trackFile);
    void deleteTrackFile(String sessionId, String trackFileId);
    TrackFile updateTrackFile(String sessionId, TrackFile trackFile);
}
