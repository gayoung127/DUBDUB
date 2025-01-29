package com.ssafy.dubdub.auth.service;

import com.ssafy.dubdub.auth.dto.AuthResponseDTO;
import com.ssafy.dubdub.auth.dto.KakaoUserDTO;
import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import com.ssafy.dubdub.auth.entity.RefreshToken;
import com.ssafy.dubdub.auth.exception.AuthException;
import com.ssafy.dubdub.config.exception.ErrorCode;
import com.ssafy.dubdub.config.jwt.JWTUtil;
import com.ssafy.dubdub.member.dto.CustomUserDetails;
import com.ssafy.dubdub.member.entity.Enum.Provider;
import com.ssafy.dubdub.member.entity.Member;
import com.ssafy.dubdub.member.repository.MemberRepository;
import com.ssafy.dubdub.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
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
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl extends DefaultOAuth2UserService implements AuthService {
    private final RefreshTokenService refreshTokenService;
    private final MemberRepository memberRepository;
    private final ClientRegistrationRepository clientRegistrationRepository;

    @Override
    public TokenResponseDTO generateToken(Long id, String email) {
        String accessToken = JWTUtil.createAccessToken(id, email);
        String refreshToken = JWTUtil.createRefreshToken(id, email);

        refreshTokenService.saveTokenInfo(email, refreshToken);

        return new TokenResponseDTO(accessToken, refreshToken);
    }

    @Override
    public Authentication getAuthentication(String token) {
        String email = JWTUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(ErrorCode.MEMBER_NOT_FOUND));

        CustomUserDetails customUserDetails = new CustomUserDetails(member, false);

        return new UsernamePasswordAuthenticationToken(
                customUserDetails,
                "",
                customUserDetails.getAuthorities()
        );
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        log.info("Loading OAuth2 user for client: {}", userRequest.getClientRegistration().getClientName());

        try {
            Map<String, Object> attributes = oauth2User.getAttributes();
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            String email = (String) kakaoAccount.get("email");
            String nickname = (String) profile.get("nickname");
            String profileImageUrl = (String) profile.get("profile_image_url");

            Optional<Member> existingMember = memberRepository.findByEmailAndProvider(email, Provider.KAKAO);
            Member member;
            boolean isNewMember = false;

            if (existingMember.isPresent()) {
                member = existingMember.get();
            } else {
                member = memberRepository.save(
                        Member.builder()
                                .provider(Provider.KAKAO)
                                .email(email)
                                .nickname(nickname)
                                .profileUrl(profileImageUrl)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()
                );
                isNewMember = true;
            }

            return new CustomUserDetails(member, isNewMember);
        } catch (Exception e) {
            log.error("Failed to process OAuth2 user: {}", e.getMessage());
            throw new OAuth2AuthenticationException("Failed to process OAuth2 user");
        }
    }

    @Override
    @Transactional
    public AuthResponseDTO kakaoLogin(String code) {
        log.info("Processing Kakao login with authorization code");

        ClientRegistration registration = clientRegistrationRepository.findByRegistrationId("kakao");
        if (registration == null) {
            throw new AuthException(ErrorCode.OAUTH_REGISTRATION_NOT_FOUND);
        }

        try {
            OAuth2AccessToken accessToken = getAccessToken(registration, code);
            OAuth2UserRequest userRequest = new OAuth2UserRequest(registration, accessToken);
            CustomUserDetails userDetails = (CustomUserDetails) loadUser(userRequest);

            TokenResponseDTO token = generateToken(
                    userDetails.getMember().getId(),
                    userDetails.getMember().getEmail()
            );

            return AuthResponseDTO.builder()
                    .token(token)
                    .isNewMember(userDetails.isNewMember())
                    .memberId(userDetails.getMember().getId())
                    .email(userDetails.getMember().getEmail())
                    .nickname(userDetails.getMember().getNickname())
                    .build();

        } catch (OAuth2AuthenticationException e) {
            log.error("OAuth2 authentication failed: {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_USER_INFO_ERROR);
        }
    }

    private OAuth2AccessToken getAccessToken(ClientRegistration registration, String code) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
            tokenRequest.add("grant_type", "authorization_code");
            tokenRequest.add("client_id", registration.getClientId());
            tokenRequest.add("client_secret", registration.getClientSecret());
            tokenRequest.add("redirect_uri", registration.getRedirectUri());
            tokenRequest.add("code", code);

            log.debug("Token request parameters: {}", tokenRequest);
            log.debug("Token URI: {}", registration.getProviderDetails().getTokenUri());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(tokenRequest, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    registration.getProviderDetails().getTokenUri(),
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            log.debug("Token response status: {}", response.getStatusCode());

            Map<String, Object> token = response.getBody();
            if (token == null || !token.containsKey("access_token")) {
                throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
            }

            Instant issuedAt = Instant.now();
            Instant expiredAt = issuedAt.plusSeconds(Long.parseLong(token.get("expires_in").toString()));

            return new OAuth2AccessToken(
                    OAuth2AccessToken.TokenType.BEARER,
                    (String) token.get("access_token"),
                    issuedAt,
                    expiredAt
            );

        } catch (HttpClientErrorException e) {
            if (e.getResponseBodyAsString().contains("KOE320")) {
                log.error("Authorization code has already been used: {}", e.getMessage());
                throw new AuthException(ErrorCode.KAKAO_AUTH_CODE_ALREADY_USED);
            }
            log.error("Failed to retrieve Kakao access token (HTTP Error): {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
        } catch (RestClientException e) {
            log.error("Failed to retrieve Kakao access token: {}", e.getMessage());
            throw new AuthException(ErrorCode.KAKAO_TOKEN_ERROR);
        }
    }

    @Override
    @Transactional
    public TokenResponseDTO reissueAccessToken(String refreshToken) {
        RefreshToken validatedToken = validateRefreshToken(refreshToken);

        return issueNewToken(validatedToken.getEmail());
    }

    private RefreshToken validateRefreshToken(String refreshToken) {
        RefreshToken redisRefreshToken = refreshTokenService.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (!JWTUtil.validateToken(refreshToken)) {
            refreshTokenService.removeRefreshToken(redisRefreshToken.getEmail());
            throw new AuthException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        return redisRefreshToken;
    }

    private TokenResponseDTO issueNewToken(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(ErrorCode.MEMBER_NOT_FOUND));

        return generateToken(member.getId(), email);
    }
}
