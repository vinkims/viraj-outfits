package ke.kigen.api.services.auth;

import ke.kigen.api.dtos.auth.AuthDTO;
import ke.kigen.api.dtos.auth.SignoutDTO;
import ke.kigen.api.models.user.EUser;

public interface IAuth {
    
    String authenticateUser(AuthDTO authDTO);

    EUser getUser(Integer userId);

    Boolean signoutUser(SignoutDTO signoutDTO);
}
