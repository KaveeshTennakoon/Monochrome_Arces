package com.monochrome.Backend.service;


import com.monochrome.Backend.dto.AuthRequest;
import com.monochrome.Backend.dto.AuthResponse;
import com.monochrome.Backend.dto.RefreshRequest;
import com.monochrome.Backend.dto.UserDto;
import com.monochrome.Backend.entity.RefreshToken;
import com.monochrome.Backend.entity.User;
import com.monochrome.Backend.repository.PermissionRepository;
import com.monochrome.Backend.repository.RefreshTokenRepository;
import com.monochrome.Backend.repository.UserRepository;
import com.monochrome.Backend.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PermissionRepository permissionRepository;

    @Transactional
    public AuthResponse login(AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userRepository.findByUsername(req.getUsername()).orElseThrow();
        String access = jwtService.generateAccessToken(user);
        String refresh = generateAndStoreRefreshToken(user);
        return AuthResponse.builder()
                .token(access)
                .refreshToken(refresh)
                .user(toDto(user))
                .build();
    }

    @Transactional
    public void logout(String username) {
        userRepository.findByUsername(username).ifPresent(u -> refreshTokenRepository.deleteByUser(u));
    }

    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken rt = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked");
        }
        User user = rt.getUser();
        String access = jwtService.generateAccessToken(user);
        return AuthResponse.builder()
                .token(access)
                .refreshToken(rt.getToken())
                .build();
    }

    private String generateAndStoreRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        RefreshToken rt = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(rt);
        return token;
    }

    public UserDto toDto(User user) {
        Set<String> permissions = user.getPermissions().stream().map(p -> p.getName()).collect(Collectors.toSet());
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .department(user.getDepartment())
                .permissions(permissions)
                .loginTime(Instant.now())
                .build();
    }

    @Transactional
    public AuthResponse register(com.monochrome.Backend.dto.RegisterRequest req, org.springframework.security.crypto.password.PasswordEncoder encoder) {
        // Ensure current user is SUPERADMIN
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        java.util.Collection<org.springframework.security.core.GrantedAuthority> authorities =
                auth != null ? (java.util.Collection<org.springframework.security.core.GrantedAuthority>) auth.getAuthorities() : java.util.List.of();
        boolean isSuperAdmin = authorities.stream().anyMatch(a -> "ROLE_SUPERADMIN".equals(a.getAuthority()));
        if (!isSuperAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Only SUPERADMIN can register admins");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        // Force role to ADMIN regardless of input
        com.monochrome.Backend.entity.Role role = com.monochrome.Backend.entity.Role.ADMIN;
        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .name(req.getName())
                .department(req.getDepartment())
                .role(role)
                .build();
        // Assign permissions if provided
        if (req.getPermissions() != null && !req.getPermissions().isEmpty()) {
            java.util.Set<com.monochrome.Backend.entity.Permission> perms = new java.util.HashSet<>();
            for (String p : req.getPermissions()) {
                permissionRepository.findByName(p).ifPresent(perms::add);
            }
            user.setPermissions(perms);
        }
        userRepository.save(user);
        String access = jwtService.generateAccessToken(user);
        String refresh = generateAndStoreRefreshToken(user);
        return com.monochrome.Backend.dto.AuthResponse.builder()
                .token(access)
                .refreshToken(refresh)
                .user(toDto(user))
                .build();
    }
}
