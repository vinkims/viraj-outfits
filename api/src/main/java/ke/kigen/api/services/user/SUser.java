package ke.kigen.api.services.user;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.user.UserDAO;
import ke.kigen.api.services.contact.IContact;
import ke.kigen.api.services.role.IRole;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SUser implements IUser {

    Logger logger = LoggerFactory.getLogger(SUser.class);

    private final IContact sContact;

    private final IRole sRole;

    private final IStatus sStatus;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    private final UserDAO userDAO;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<EUser> buildFilterSpec(String searchQuery) {
        
        SpecBuilder<EUser> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EUser>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

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

    @Override
    public Optional<EUser> getByContactValue(String contactValue) {
        return userDAO.findByContactValue(contactValue);
    }

    @Override
    public Optional<EUser> getById(Integer userId) {
        return userDAO.findById(userId);
    }

    @Override
    public EUser getById(Integer userId, Boolean handleNotFound) {
        
        Optional<EUser> user = getById(userId);
        if (!user.isPresent() && handleNotFound) {
            throw new NotFoundException("user with specified id not found", "userId");
        }
        return user.get();
    }

    @Override
    public Optional<EUser> getByIdOrContactValue(String userValue) {
        Integer userId;
        try {
            userId = Integer.valueOf(userValue);
        } catch (NumberFormatException e) {
            userId = (Integer) null;
            logger.error("ERROR: [SUser.getByIdOrContactValue]\n[MSG] {}", e.getMessage());
            return getByContactValue(userValue);
        }

        return userDAO.findByIdOrContactValue(userId, userValue);
    }

    @Override
    public EUser getByIdOrContactValue(String userValue, Boolean handleNotFound) {

        Optional<EUser> user = getByIdOrContactValue(userValue);
        if (!user.isPresent() && handleNotFound) {
            throw new NotFoundException("user with specified id or contact value not found", "userValue");
        }
        return user.get();
    }

    @Override
    public List<EUser> getFilteredList(String searchQuery) {
        return userDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EUser> getPaginatedList(PageDTO pageDTO) {
        
        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return userDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EUser user) {
        userDAO.save(user);
    }

    private void setContacts(EUser user, List<ContactDTO> contacts) {
        if (contacts == null || contacts.isEmpty()) {
            return;
        }

        List<EContact> contactList = new ArrayList<>();
        for (ContactDTO contactDTO : contacts) {
            EContact contact = sContact.create(user, contactDTO);
            contactList.add(contact);
        }
        user.setContacts(contactList);
    }

    private void setRole(EUser user, Integer roleId) {
        if (roleId == null) { return; }

        ERole role = sRole.getById(roleId, true);
        user.setRole(role);
    }

    private void setStatus(EUser user, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        user.setStatus(status);
    }

    @Override
    public EUser update(String userValue, UserDTO userDTO) throws IllegalAccessException, IllegalArgumentException, 
            InvocationTargetException, NoSuchMethodException, SecurityException {

        EUser user = getByIdOrContactValue(userValue, true);

        String[] fields = {"FirstName", "LastName", "MiddleName", "Password"};
        for (String field : fields) {
            Method getField = UserDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(userDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                EUser.class.getMethod("set" + field, fieldValue.getClass()).invoke(user, fieldValue);
            }
        }

        setContacts(user, userDTO.getContacts());
        setRole(user, userDTO.getRoleId());
        setStatus(user, userDTO.getStatusId());
        user.setUpdatedOn(LocalDateTime.now());

        save(user);
        return user;
    }
    
}
