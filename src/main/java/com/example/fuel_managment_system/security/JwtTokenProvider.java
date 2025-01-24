package com.example.fuel_managment_system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final Key JWT_SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private final long JWT_EXPIRATION_MS = 604800000L; // 7 days

    public String generateToken(String username) {
        System.out.println("generated ");

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + JWT_EXPIRATION_MS))
                .signWith(JWT_SECRET)
                .compact();
    }

    public String getIdentifier(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    //get registrationNumber from token


    public boolean validateToken(String token) {
        System.out.println("validating");

        try {
            Jwts.parserBuilder().setSigningKey(JWT_SECRET).build().parseClaimsJws(token);
            System.out.println("validated");

            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}