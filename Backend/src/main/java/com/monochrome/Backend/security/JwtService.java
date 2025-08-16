package com.monochrome.Backend.security;

import com.monochrome.Backend.entity.Permission;
import com.monochrome.Backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final SecretKey key;
    private final int accessExpMin;
    private final int refreshExpDays;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-exp-min}") int accessExpMin,
            @Value("${app.jwt.refresh-exp-days}") int refreshExpDays
    ) {
        // allow plain text secret; if looks like base64, decode, else use bytes
        byte[] secretBytes = secret.matches("[A-Za-z0-9+/=]+") && secret.length() % 4 == 0
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes();
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.accessExpMin = accessExpMin;
        this.refreshExpDays = refreshExpDays;
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Set<String> perms = user.getPermissions().stream().map(Permission::getName).collect(Collectors.toSet());
        Map<String, Object> claims = Map.of(
                "role", user.getRole().name(),
                "permissions", perms,
                "userId", user.getId()
        );
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessExpMin, ChronoUnit.MINUTES)))
                .addClaims(claims)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
