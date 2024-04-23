package ke.kigen.api.services.auth;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.auth.BlacklistTokenDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBlacklist implements IBlacklist {
    
    private final BlacklistTokenDAO blacklistTokenDAO;

    @Override
    public Boolean checkExistsByTokenHash(Integer tokenHash) {
        return blacklistTokenDAO.existsByTokenHash(tokenHash);
    }

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
    public Integer getTokenHash(String token) {
        return token.hashCode();
    }

    @Override
    public void save(EBlacklistToken blacklistToken) {
        blacklistTokenDAO.save(blacklistToken);
    }
}
