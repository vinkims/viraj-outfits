package ke.kigen.api.services.contact.contact_type;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.contacts.EContactType;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContactType implements IContactTypeCreate, IContactTypeListing, IContactTypeUpdate {
    
    private final IContactTypeCreate sContactTypeCreate;

    private final IContactTypeListing sContactTypeListing;

    private final IContactTypeUpdate sContactTypeUpdate;

    @Override
    public Specification<EContactType> buildFilterSpec(String searchQuery) {
        return sContactTypeListing.buildFilterSpec(searchQuery);
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return sContactTypeListing.checkExistsByName(name);
    }

    @Override
    public EContactType create(ContactTypeDTO contactTypeDTO) {
        return sContactTypeCreate.create(contactTypeDTO);
    }

    @Override
    public Optional<EContactType> getById(Integer contactTypeId) {
        return sContactTypeListing.getById(contactTypeId);
    }

    @Override
    public EContactType getById(Integer contactTypeId, Boolean handleNotFound) {
        return sContactTypeListing.getById(contactTypeId, handleNotFound);
    }

    @Override
    public List<EContactType> getFilteredList(String searchQuery) {
        return sContactTypeListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<EContactType> getPaginatedList(PageDTO pageDTO) {
        return sContactTypeListing.getPaginatedList(pageDTO);
    }

    @Override
    public EContactType update(Integer contactTypeId, ContactTypeDTO contactTypeDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        return sContactTypeUpdate.update(contactTypeId, contactTypeDTO);
    }
}
