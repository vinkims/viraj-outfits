package ke.kigen.api.services.user;

import java.lang.reflect.InvocationTargetException;

import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;

public interface IUserUpdate {
    
    EUser update(String userValue, UserDTO userDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
