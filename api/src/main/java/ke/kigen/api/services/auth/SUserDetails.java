package ke.kigen.api.services.auth;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.exceptions.InvalidInputException;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.services.user.SUser;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SUserDetails implements IUserDetails {

    private final MainConfig mainConfig;

    private final SUser sUser;

    @Override
    public Boolean checkIsSystemAdmin() {
        EUser user = getActiveUserByContact();
        Integer roleId = user.getRole().getId();
        
        return roleId.equals(mainConfig.getRole().getSystemAdminId());
    }

    @Override
    public Boolean checkIsAdmin() {
        EUser user = getActiveUserByContact();
        Integer roleId = user.getRole().getId();

        return roleId.equals(mainConfig.getRole().getAdminId());
    }

    @Override
    public EUser getActiveUserByContact() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userValue = ((UserDetails) principal).getUsername();
        
        return sUser.getByContactValue(userValue).get();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        EUser user = sUser.getByContactValue(username).orElseThrow(
            () -> new InvalidInputException("invalid credentials provided", "user/password")
        );

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole().getId().toString()));

        String password = user.getPassword();
        // converts to org.springframework.security.core.userdetails.UserDetails object
        UserDetails userDetails = (UserDetails) new User(
            username, 
            password == null ? "" : password, 
            grantedAuthorities);

        return userDetails;
    }
    
}
