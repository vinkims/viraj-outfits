package ke.kigen.api.services.auth;

import org.springframework.security.core.userdetails.UserDetailsService;

import ke.kigen.api.models.user.EUser;

public interface IUserDetails extends UserDetailsService {
    
    Boolean checkIsSystemAdmin();

    Boolean checkIsAdmin();

    EUser getActiveUserByContact();
}
