package com.ssafy.dubdub.wss.service;

import com.ssafy.dubdub.wss.dto.AudioAsset;
import com.ssafy.dubdub.wss.dto.TrackFile;
import com.ssafy.dubdub.wss.dto.TrackRecorder;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Primary
@RequiredArgsConstructor
@Service
public class StudioRedisStoreServiceImpl implements StudioStoreService {
    private final RedisTemplate<String, Object> redisTemplate;

    private String generateRedisKey(String sessionId, String type, String id) {
        return "studio:" + sessionId + ":" + type + ":" + id;
    }

    @Override
    public AudioAsset saveAsset(String sessionId, AudioAsset audioAsset) {
        String redisKey = generateRedisKey(sessionId, "audio", audioAsset.getId());
        redisTemplate.opsForValue().set(redisKey, audioAsset);
        return audioAsset;
    }

    @Override
    public void deleteAsset(String sessionId, String assetId) {
        String redisKey = generateRedisKey(sessionId, "audio", assetId);
        redisTemplate.delete(redisKey);
    }

    @Override
    public Optional<List<TrackRecorder>> getTrackRecorderList(String sessionId) {
        return Optional.empty();
    }

    @Override
    public TrackRecorder saveTrackRecorder(String sessionId, TrackRecorder trackRecorder) {
        Optional<List<AudioAsset>> list = getAssetList(sessionId);
        System.out.println(list.get());
        return null;
    }

    @Override
    public void deleteTrackRecorder(String sessionId, String trackRecorderId) {
    }

    @Override
    public Optional<List<AudioAsset>> getAssetList(String sessionId) {
        String pattern = "studio:" + sessionId + ":audio:*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys == null || keys.isEmpty()) return Optional.empty();

        List<Object> assets = redisTemplate.opsForValue().multiGet(keys);
        return Optional.of(assets.stream()
                .map(obj -> (AudioAsset) obj)
                .collect(Collectors.toList()));
    }

    @Override
    public TrackFile saveTrackFile(String sessionId, TrackFile trackFile) {
        String redisKey = generateRedisKey(sessionId, "track", trackFile.getId());
        redisTemplate.opsForValue().set(redisKey, trackFile);
        return trackFile;
    }

    @Override
    public void deleteTrackFile(String sessionId, String trackFileId) {
        String redisKey = generateRedisKey(sessionId, "track", trackFileId);
        redisTemplate.delete(redisKey);
    }

    @Override
    public Optional<List<TrackFile>> getTrackFileList(String sessionId) {
        String pattern = "studio:" + sessionId + ":track:*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys == null || keys.isEmpty()) return Optional.empty();

        List<Object> tracks = redisTemplate.opsForValue().multiGet(keys);
        return Optional.of(tracks.stream()
                .map(obj -> (TrackFile) obj)
                .collect(Collectors.toList()));
    }

    public void updateTrackFileField(String sessionId, String trackId, String field, Object value) {
        String redisKey = generateRedisKey(sessionId, "track", trackId);
        redisTemplate.opsForHash().put(redisKey, field, value);
    }
}
