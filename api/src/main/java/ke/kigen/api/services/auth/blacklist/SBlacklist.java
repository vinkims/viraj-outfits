package ke.kigen.api.services.auth.blacklist;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBlacklist implements IBlacklistCreate, IBlacklistListing {
    
    private final IBlacklistCreate sBlacklistCreate;

    private final IBlacklistListing sBlacklistListing;

    @Override
    public Boolean checkExistsByTokenHash(Integer tokenHash) {
        return sBlacklistListing.checkExistsByTokenHash(tokenHash);
    }

    @Override
    public EBlacklistToken create(String token, EUser user) {
        return sBlacklistCreate.create(token, user);
    }

    @Override
    public Integer getTokenHash(String token) {
        return sBlacklistListing.getTokenHash(token);
    }

    @Override
    public void save(EBlacklistToken blacklistToken) {
        sBlacklistCreate.save(blacklistToken);
    }
}
