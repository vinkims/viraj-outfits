package ke.kigen.api.services.user;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;

@Service
public class SUserUpdate extends SBaseUser implements IUserUpdate {

    @Override
    public EUser update(String userValue, UserDTO userDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EUser user = getByIdOrContactValue(userValue, true);

        String[] fields = {"FirstName", "LastName", "MiddleName", "Password"};
        for (String field : fields) {
            Method getField = UserDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(userDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
            }
            EUser.class.getMethod("set" + field, fieldValue.getClass()).invoke(user, fieldValue);
        }

        setContacts(user, userDTO.getContacts());
        setRole(user, userDTO.getRoleId());
        setStatus(user, userDTO.getStatusId());

        save(user);
        return user;
    }
    
}
