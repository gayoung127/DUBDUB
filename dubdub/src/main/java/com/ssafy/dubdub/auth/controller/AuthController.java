package com.ssafy.dubdub.auth.controller;

import com.ssafy.dubdub.auth.dto.AuthResponseDTO;
import com.ssafy.dubdub.auth.dto.TokenResponseDTO;
import com.ssafy.dubdub.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "카카오 소셜 로그인 통신")
    @GetMapping("/login")
    public ResponseEntity<AuthResponseDTO> kakaoLogin(@RequestParam String code) {
        AuthResponseDTO response = authService.kakaoLogin(code);

        return ResponseEntity
                .status(response.isNewMember() ? HttpStatus.CREATED : HttpStatus.OK)
                .body(response);
    }

    @Operation(summary = "access token 재발급")
    @PostMapping("/token")
    public ResponseEntity<TokenResponseDTO> reissueAccessToken(
            @RequestHeader("Authorization") String bearerToken) {
        String accessToken = bearerToken.substring(7);
        return ResponseEntity.ok(authService.refreshToken(accessToken));
    }
}
