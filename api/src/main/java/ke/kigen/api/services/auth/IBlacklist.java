package ke.kigen.api.services.auth;

import ke.kigen.api.models.auth.EBlacklistToken;
import ke.kigen.api.models.user.EUser;

public interface IBlacklist {
    
    Boolean checkExistsByTokenHash(Integer tokenHash);
    
    EBlacklistToken create(String token, EUser user);

    Integer getTokenHash(String token);

    void save(EBlacklistToken blacklistToken);
}
