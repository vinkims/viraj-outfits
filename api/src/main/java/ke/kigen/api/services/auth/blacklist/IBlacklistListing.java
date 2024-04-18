package ke.kigen.api.services.auth.blacklist;

public interface IBlacklistListing {
    
    Boolean checkExistsByTokenHash(Integer tokenHash);

    Integer getTokenHash(String token);
}
