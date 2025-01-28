package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.dto.KakaoUserDTO;
import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import com.ssafy.dubdub.auth.entity.RefreshToken;
import com.ssafy.dubdub.auth.exception.AuthException;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.config.jwt.JWTUtil;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService{
    private final RefreshTokenService refreshTokenService;
    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final ClientRegistrationRepository clientRegistrationRepository;

    @Override
    @Transactional
    public TokenResponseDTO kakaoLogin(String code) {
        ClientRegistration registration = clientRegistrationRepository.findByRegistrationId("kakao");
        if (registration == null) {
            throw new AuthException(ErrorCode.OAUTH_REGISTRATION_NOT_FOUND);
        }
        OAuth2AccessToken accessToken = getAccessToken(registration, code);
        OAuth2User oauth2User = getOAuth2User(registration, accessToken);
        KakaoUserDTO userInfo = extractKakaoUserInfo(oauth2User);

        Member member = memberService.findByEmailOrRegister(userInfo);

        return jwtUtil.generateToken(member.getId(), member.getEmail());
    }

    private OAuth2AccessToken getAccessToken(ClientRegistration registration, String code) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", registration.getClientId());
            params.add("client_secret", registration.getClientSecret());
            params.add("redirect_uri", registration.getRedirectUri());
            params.add("code", code);

            log.info("Token request parameters: {}", params);
            log.info("Token URI: {}", registration.getProviderDetails().getTokenUri());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    registration.getProviderDetails().getTokenUri(),
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            log.info("Token response status: {}", response.getStatusCode());
            log.info("Token response body: {}", response.getBody());

            Map<String, Object> token = response.getBody();
            if (token == null || !token.containsKey("access_token")) {
                throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
            }

            return new OAuth2AccessToken(
                    OAuth2AccessToken.TokenType.BEARER,
                    (String) token.get("access_token"),
                    Instant.now(),
                    Instant.now().plusSeconds(Long.parseLong(token.get("expires_in").toString()))
            );
        }catch (HttpClientErrorException e) {
            // Check if it's KOE320 error
            if (e.getResponseBodyAsString().contains("KOE320")) {
                log.error("Authorization code has already been used: {}", e.getMessage());
                throw new AuthException(ErrorCode.KAKAO_AUTH_CODE_ALREADY_USED);
            }
            log.error("카카오 액세스 토큰 받기 실패 (HTTP Error): {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
        } catch (RestClientException e) {
            log.error("카카오 액세스 토큰 받기 실패: {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
        }
    }

    private OAuth2User getOAuth2User(ClientRegistration registration, OAuth2AccessToken accessToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken.getTokenValue());

            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    registration.getProviderDetails().getUserInfoEndpoint().getUri(),
                    HttpMethod.GET,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> attributes = response.getBody();
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                    attributes,
                    "id"
            );
        } catch (RestClientException e) {
            log.error("카카오 사용자 정보 받기 실패: {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_USER_INFO_ERROR);
        }
    }

    private KakaoUserDTO extractKakaoUserInfo(OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        return KakaoUserDTO.builder()
                .email((String) kakaoAccount.get("email"))
                .nickname((String) profile.get("nickname"))
                .profileImage((String) profile.get("profile_image_url"))
                .build();
    }

    @Override
    @Transactional
    public TokenResponseDTO refreshToken(String refreshToken) {
        RefreshToken redisRefreshToken = refreshTokenService.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (!jwtUtil.validateToken(refreshToken)) {
            refreshTokenService.removeRefreshToken(redisRefreshToken.getEmail());
            throw new AuthException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        String email = redisRefreshToken.getEmail();
        Member member = memberService.findByEmail(email);

        TokenResponseDTO newToken = jwtUtil.generateToken(member.getId(), email);
        refreshTokenService.saveTokenInfo(email, newToken.getRefreshToken());

        return newToken;
    }
}
