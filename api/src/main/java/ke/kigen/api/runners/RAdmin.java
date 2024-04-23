package ke.kigen.api.runners;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.configs.properties.admin.AdminConfig;
import ke.kigen.api.configs.properties.contact.ContactConfig;
import ke.kigen.api.configs.properties.role.RoleConfig;
import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.services.user.IUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class RAdmin implements CommandLineRunner {

    private final MainConfig mainConfig;

    private final IUser sUser;
    
    @Override
    public void run(String... args) throws Exception {

        AdminConfig adminConfig = mainConfig.getAdmin();
        ContactConfig contactConfig = mainConfig.getContact();
        RoleConfig roleConfig = mainConfig.getRole();

        String firstName = "system";
        String lastName = "admin";

        log.info("\n>>> check if admin user exists");

        Optional<EUser> userOpt = sUser.getByContactValue(adminConfig.getEmail());
        if (userOpt.isPresent()) {
            log.info("\n[LOCATION]run:[MSG] admin account already exists");
            return;
        }

        ContactDTO contactDTO = new ContactDTO();
        contactDTO.setContactTypeId(contactConfig.getEmailTypeId());
        contactDTO.setValue(adminConfig.getEmail());
        List<ContactDTO> contacts = new ArrayList<>();
        contacts.add(contactDTO);

        UserDTO userDTO = new UserDTO();
        userDTO.setContacts(contacts);
        userDTO.setFirstName(firstName);
        userDTO.setLastName(lastName);
        userDTO.setPassword(adminConfig.getPassword());
        userDTO.setRoleId(roleConfig.getSystemAdminId());

        EUser admin = sUser.create(userDTO);

        log.info("\nSystem admin created: id=>{}, name=>{}, email=>{}",
            admin.getId(),
            String.format("%s %s", firstName, lastName),
            roleConfig.getSystemAdminId()
        );
    }
    
}
