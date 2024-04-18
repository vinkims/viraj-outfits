package ke.kigen.api.services.user;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;

@Service
public class SUserCreate extends SBaseUser implements IUserCreate {

    @Override
    public EUser create(UserDTO userDTO) {
        EUser user = new EUser();
        user.setCreatedOn(LocalDateTime.now());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setMiddleName(userDTO.getMiddleName());
        user.setPassword(userDTO.getPassword());
        setRole(user, userDTO.getRoleId());
        Integer statusId = userDTO.getStatusId() == null 
            ? mainConfig.getStatus().getActiveId() 
            : userDTO.getStatusId();
        setStatus(user, statusId);

        save(user);
        setContacts(user, userDTO.getContacts());
        return user;
    }
    
}
