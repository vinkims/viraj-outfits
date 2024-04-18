package ke.kigen.api.services.auth.blacklist;

import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;

public interface IBlacklistCreate {
    
    EBlacklistToken create(String token, EUser user);

    void save(EBlacklistToken blacklistToken);
}
