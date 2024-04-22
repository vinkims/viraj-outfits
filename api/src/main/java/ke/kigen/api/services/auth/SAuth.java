package ke.kigen.api.services.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.auth.AuthDTO;
import ke.kigen.api.dtos.auth.SignoutDTO;
import ke.kigen.api.exceptions.InvalidInputException;
import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.services.auth.blacklist.SBlacklist;
import ke.kigen.api.services.user.SUser;
import ke.kigen.api.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SAuth implements IAuth {

    private final AuthenticationManager authenticationManager;

    private final IUserDetails sUserDetails;

    private final JwtUtil jwtUtil;

    private final SBlacklist sBlacklist;

    private final SUser sUser;
    
    @Override
    public String authenticateUser(AuthDTO authDTO) {

        EUser user = sUser.getByContactValue(authDTO.getUsername().toLowerCase())
            .orElseThrow(() -> new InvalidInputException("invalid credentials provided", "user/password"));

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authDTO.getUsername().toLowerCase(),
                    authDTO.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            log.info("\n[LOCATION]-SAuth.authenticateUser\n[MSG]{}", e.getLocalizedMessage());
            throw new InvalidInputException("invalid credentials provided", "user/password");
        }

        UserDetails userDetails = sUserDetails.loadUserByUsername(authDTO.getUsername().toLowerCase());

        Map<String, Object> claims = new HashMap<>();
        claims.put("user", authDTO.getUsername().toLowerCase());
        claims.put("userId", user.getId());
        claims.put("userRole", user.getRole().getId());

        final String token = jwtUtil.generateToken(userDetails, claims);

        return token;
    }

    @Override
    public Boolean signoutUser(SignoutDTO signoutDTO) {

        EUser user = sUser.getById(signoutDTO.getUserId())
            .orElseThrow(() -> new InvalidInputException("invalid userId", "userId"));
        
        EBlacklistToken blacklistToken = sBlacklist.create(signoutDTO.getToken(), user);

        return blacklistToken != null;
    }
    
}
