package ke.kigen.api.services.contact.contact_type;

import java.lang.reflect.InvocationTargetException;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.models.contacts.EContactType;

public interface IContactTypeUpdate {
    
    EContactType update(Integer contactTypeId, ContactTypeDTO contactTypeDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
