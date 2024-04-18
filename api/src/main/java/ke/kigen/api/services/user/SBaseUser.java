package ke.kigen.api.services.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.user.UserDAO;
import ke.kigen.api.services.contact._contact.SContact;
import ke.kigen.api.services.role.SRole;
import ke.kigen.api.services.status.SStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseUser {
    
    Logger logger = LoggerFactory.getLogger(SBaseUser.class);

    protected final MainConfig mainConfig;

    protected final SContact sContact;

    protected final SRole sRole;

    protected final SStatus sStatus;

    protected final UserDAO userDAO;

    public SBaseUser() {
        this.mainConfig = null;
        this.sContact = null;
        this.sRole = null;
        this.sStatus = null;
        this.userDAO = null;
    }

    protected Optional<EUser> getByContactValue(String contactValue) {
        return userDAO.findByContactValue(contactValue);
    }

    protected Optional<EUser> getById(Integer userId) {
        return userDAO.findById(userId);
    }

    protected EUser getById(Integer userId, Boolean handleNotFound) {

        Optional<EUser> user = getById(userId);
        if (!user.isPresent() && handleNotFound) {
            throw new NotFoundException("user with specified id not found", "userId");
        }
        return user.get();
    }

    protected Optional<EUser> getByIdOrContactValue(String userValue) {
        Integer userId;
        try {
            userId = Integer.valueOf(userValue);
        } catch (NumberFormatException e) {
            userId = (Integer) null;
            logger.error("ERROR: [SBaseUser.getByIdOrContactValue]\n[MSG] {}", e.getMessage());
            return getByContactValue(userValue);
        }

        return userDAO.findByIdOrContactValue(userId, userValue);
    }

    protected EUser getByIdOrContactValue(String userValue, Boolean handleNotFound) {
        
        Optional<EUser> user = getByIdOrContactValue(userValue);
        if (!user.isPresent() && handleNotFound) {
            throw new NotFoundException("user with specified id or contact value not found", "userValue");
        }
        return user.get();
    }

    protected void save(EUser user) {
        userDAO.save(user);
    }

    protected void setContacts(EUser user, List<ContactDTO> contacts) {
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

    protected void setRole(EUser user, Integer roleId) {
        if (roleId == null) { return; }

        ERole role = sRole.getById(roleId, true);
        user.setRole(role);
    }

    protected void setStatus(EUser user, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        user.setStatus(status);
    }
}
