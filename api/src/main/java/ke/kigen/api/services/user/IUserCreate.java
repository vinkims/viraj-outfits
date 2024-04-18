package ke.kigen.api.services.user;

import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;

public interface IUserCreate {
    
    EUser create(UserDTO userDTO);
}
