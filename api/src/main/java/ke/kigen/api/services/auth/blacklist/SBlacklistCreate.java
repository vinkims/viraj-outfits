package ke.kigen.api.services.auth.blacklist;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.auth.BlacklistTokenDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBlacklistCreate implements IBlacklistCreate {
    
    private final BlacklistTokenDAO blacklistTokenDAO;

    @Override
    public EBlacklistToken create(String token, EUser user) {
        EBlacklistToken blacklistToken = new EBlacklistToken();
        blacklistToken.setCreatedOn(LocalDateTime.now());
        blacklistToken.setTokenHash(token.hashCode());
        blacklistToken.setUser(user);

        save(blacklistToken);
        return blacklistToken;
    }

    @Override
    public void save(EBlacklistToken blacklistToken) {
        blacklistTokenDAO.save(blacklistToken);
    }
    
}
