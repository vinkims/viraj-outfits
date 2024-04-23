package ke.kigen.api.utils;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.security.auth.message.AuthException;
import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.configs.properties.security.SecurityConfig;
import ke.kigen.api.services.auth.blacklist.SBlacklist;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {
    
    private final SBlacklist sBlacklist;
    
    private final MainConfig mainConfig;

    private String createToken(Map<String, Object> claims, String subject) {
        SecurityConfig securityConfig = mainConfig.getSecurity();
        // Sets expiration based on role
        Integer userApiClientId = mainConfig.getRole().getApiClientId();
        Integer tokenValidityPeriod = claims.getOrDefault("userRole", "").equals(userApiClientId) 
            ? securityConfig.getTokenValidityPeriodSec()
            : securityConfig.getTokenValidityPeriod();
            
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60L * 60L * tokenValidityPeriod))
            .signWith(Keys.hmacShaKeyFor(securityConfig.getSecretKey().getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    private Claims extractAllClaims(String token) throws AuthException {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(mainConfig.getSecurity().getSecretKey().getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            log.error("\n[LOCATION]-JwtUtil.extractAllClaims:\n[CLASS]{}\n[MSG]{}", e.getClass(), e.getLocalizedMessage());
            throw new AuthException("Invalid token provided");
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) throws AuthException {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Date extractExpiration(String token) throws AuthException {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUsername(String token) throws AuthException {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(UserDetails userDetails, Map<String, Object> claims) {
        return createToken(claims, userDetails.getUsername());
    }

    private Boolean isTokenBlacklisted(String token) {
        return sBlacklist.checkExistsByTokenHash(sBlacklist.getTokenHash(token));
    }

    private Boolean isTokenExpired(String token) throws AuthException {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) throws AuthException {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && !isTokenBlacklisted(token));
    }
}
