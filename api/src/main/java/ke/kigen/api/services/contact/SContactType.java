package ke.kigen.api.services.contact;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.repositories.contacts.ContactTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContactType implements IContactType {

    private final ContactTypeDAO contactTypeDAO;

    private final SpecFactory specFactory;
    
    @Override
    public Specification<EContactType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EContactType> specBuilder = new SpecBuilder();

        specBuilder = (SpecBuilder<EContactType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return contactTypeDAO.existsByName(name);
    }

    @Override
    public EContactType create(ContactTypeDTO contactTypeDTO) {
        EContactType contactType = new EContactType();
        contactType.setDescription(contactTypeDTO.getDescription());
        contactType.setName(contactTypeDTO.getName());
        contactType.setRegexValue(contactTypeDTO.getRegexValue());

        save(contactType);
        return contactType;
    }

    @Override
    public Optional<EContactType> getById(Integer contactTypeId) {
        return contactTypeDAO.findById(contactTypeId);
    }

    @Override
    public EContactType getById(Integer contactTypeId, Boolean handleNotFound) {

        Optional<EContactType> contactType = getById(contactTypeId);
        if (!contactType.isPresent() && handleNotFound) {
            throw new NotFoundException("contact type with specified id not found", "contactTypeId");
        }
        return contactType.get();
    }

    @Override
    public List<EContactType> getFilteredList(String searchQuery) {
        return contactTypeDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EContactType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return contactTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EContactType contactType) {
        contactTypeDAO.save(contactType);
    }

    @Override
    public EContactType update(Integer contactTypeId, ContactTypeDTO contactTypeDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {
        
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
