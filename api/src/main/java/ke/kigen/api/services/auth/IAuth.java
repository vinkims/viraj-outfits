package ke.kigen.api.services.auth;

import ke.kigen.api.dtos.auth.AuthDTO;
import ke.kigen.api.dtos.auth.SignoutDTO;

public interface IAuth {
    
    String authenticateUser(AuthDTO authDTO);

    Boolean signoutUser(SignoutDTO signoutDTO);
}
