package ke.kigen.api.services.auth.blacklist;

import org.springframework.stereotype.Service;

import ke.kigen.api.repositories.auth.BlacklistTokenDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBlacklistListing implements IBlacklistListing {

    private final BlacklistTokenDAO blacklistTokenDAO;
    
    @Override
    public Boolean checkExistsByTokenHash(Integer tokenHash) {
        return blacklistTokenDAO.existsByTokenHash(tokenHash);
    }

    @Override
    public Integer getTokenHash(String token) {
        return token.hashCode();
    }
    
}
