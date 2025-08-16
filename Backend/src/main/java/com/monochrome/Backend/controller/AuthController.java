package com.monochrome.Backend.controller;

import com.monochrome.Backend.dto.AuthRequest;
import com.monochrome.Backend.dto.AuthResponse;
import com.monochrome.Backend.dto.*;
import com.monochrome.Backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('SUPERADMIN')")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req, passwordEncoder));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
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
