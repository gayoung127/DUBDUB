package com.ssafy.dubdub.wss.service;

import com.ssafy.dubdub.wss.dto.AudioAsset;
import com.ssafy.dubdub.wss.dto.TrackFile;
import com.ssafy.dubdub.wss.dto.TrackRecorder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Transactional
@Service
public class StudioMemoryServiceImpl implements StudioStoreService {
    private final Map<String, Map<String, AudioAsset>> assetMap = new ConcurrentHashMap<>();
    private final Map<String, Map<String, TrackRecorder>> trackRecorderMap = new ConcurrentHashMap<>();
    private final Map<String, Map<String, TrackFile>> trackFileMap = new ConcurrentHashMap<>();

    @Override
    public List<AudioAsset> getAssetList(String sessionId) {
        return Optional.ofNullable(assetMap.get(sessionId))
                .map(sessionAssets -> List.copyOf(sessionAssets.values()))
                .orElse(Collections.emptyList());
    }

    @Override
    public AudioAsset addAsset(String sessionId, AudioAsset audioAsset) {
        assetMap.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(audioAsset.getId(), audioAsset);
        return audioAsset;
    }

    @Override
    public void deleteAsset(String sessionId, String assetId) {
        Optional.ofNullable(assetMap.get(sessionId))
                .ifPresent(sessionAssets -> sessionAssets.remove(assetId));
    }

    @Override
    public AudioAsset updateAsset(String sessionId, AudioAsset audioAsset) {
        return Optional.ofNullable(assetMap.get(sessionId))
                .map(sessionAssets -> sessionAssets.put(audioAsset.getId(), audioAsset))
                .orElse(null);
    }

    @Override
    public List<TrackRecorder> getTrackRecorderList(String sessionId) {
        return Optional.ofNullable(trackRecorderMap.get(sessionId))
                .map(recorders -> List.copyOf(recorders.values()))
                .orElse(Collections.emptyList());
    }

    @Override
    public TrackRecorder addTrackRecorder(String sessionId, TrackRecorder trackRecorder) {
        trackRecorderMap.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(trackRecorder.getTrackId(), trackRecorder);
        return trackRecorder;
    }

    @Override
    public void deleteTrackRecorder(String sessionId, String trackRecorderId) {
        Optional.ofNullable(trackRecorderMap.get(sessionId))
                .ifPresent(recorders -> recorders.remove(trackRecorderId));
    }

    @Override
    public TrackRecorder updateTrackRecorder(String sessionId, TrackRecorder trackRecorder) {
        return Optional.ofNullable(trackRecorderMap.get(sessionId))
                .map(recorders -> recorders.put(trackRecorder.getTrackId(), trackRecorder))
                .orElse(null);
    }

    @Override
    public List<TrackFile> getTrackFileList(String sessionId) {
        return Optional.ofNullable(trackFileMap.get(sessionId))
                .map(files -> List.copyOf(files.values()))
                .orElse(Collections.emptyList());
    }

    @Override
    public TrackFile addTrackFile(String sessionId, TrackFile trackFile) {
        trackFileMap.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(trackFile.getId(), trackFile);
        return trackFile;
    }

    @Override
    public void deleteTrackFile(String sessionId, String trackFileId) {
        Optional.ofNullable(trackFileMap.get(sessionId))
                .ifPresent(files -> files.remove(trackFileId));
    }

    @Override
    public TrackFile updateTrackFile(String sessionId, TrackFile trackFile) {
        return Optional.ofNullable(trackFileMap.get(sessionId))
                .map(files -> files.put(trackFile.getId(), trackFile))
                .orElse(null);
    }
}