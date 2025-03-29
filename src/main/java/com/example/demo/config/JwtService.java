package com.example.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    private final SecretKey secretKey;
    private final long jwtExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long jwtExpirationMs
    ) {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            if (keyBytes.length < 32) {
                throw new IllegalArgumentException("Key must be at least 256 bits (32 bytes)");
            }
            this.secretKey = Keys.hmacShaKeyFor(keyBytes);
            this.jwtExpirationMs = jwtExpirationMs;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize JwtService: " +
                    "Please check your jwt.secret in application.properties", e);
        }
    }

    // ✅ Генерация токена
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(secretKey, io.jsonwebtoken.SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Получение email из токена
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // ✅ Проверка валидности токена
    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // 🔍 Парсим токен
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)  // используем verifyWith вместо setSigningKey
                .build()  // нужно вызвать build() перед парсингом
                .parseSignedClaims(token)  // используем parseSignedClaims вместо parseClaimsJws
                .getPayload();  // используем getPayload() вместо getBody()
    }

    // ✅ Проверка истечения срока действия токена
    private boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }
}
