package com.monochrome.Backend.repository;

import com.monochrome.Backend.entity.RefreshToken;
import com.monochrome.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    long deleteByUser(User user);

    void deleteByExpiresAtBefore(Instant time);
}
