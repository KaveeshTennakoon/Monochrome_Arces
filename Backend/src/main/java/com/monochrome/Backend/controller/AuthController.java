package com.monochrome.Backend.controller;

import com.monochrome.Backend.dto.AuthRequest;
import com.monochrome.Backend.dto.AuthResponse;
import com.monochrome.Backend.dto.ClientLoginRequest;
import com.monochrome.Backend.dto.ClientRegisterRequest;
import com.monochrome.Backend.dto.RefreshRequest;
import com.monochrome.Backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // Client endpoints
    @PostMapping("/client/register")
    public ResponseEntity<AuthResponse> clientRegister(@RequestBody @Valid ClientRegisterRequest req) {
        return ResponseEntity.ok(authService.clientRegister(req));
    }

    @PostMapping("/client/login")
    public ResponseEntity<AuthResponse> clientLogin(@RequestBody @Valid ClientLoginRequest req) {
        return ResponseEntity.ok(authService.clientLogin(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody @Valid RefreshRequest req) {
        return ResponseEntity.ok(authService.refresh(req));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@AuthenticationPrincipal UserDetails user) {
        if (user != null) {
            authService.logout(user.getUsername());
        }
    }
}
