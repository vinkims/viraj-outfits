package ke.kigen.api.services.contact.contact_type;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.models.contacts.EContactType;

@Service
public class SContactTypeUpdate extends SBaseContactType implements IContactTypeUpdate {

    @Override
    public EContactType update(Integer contactTypeId, ContactTypeDTO contactTypeDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EContactType contactType = getById(contactTypeId, true);

        String[] fields = {"Description", "Name", "RegexValue"};
        for (String field : fields) {
            Method getField = ContactTypeDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(contactTypeDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
            }
            EContactType.class.getMethod("set" + field, fieldValue.getClass()).invoke(contactType, fieldValue);
        }

        save(contactType);
        return contactType;
    }
    
}
