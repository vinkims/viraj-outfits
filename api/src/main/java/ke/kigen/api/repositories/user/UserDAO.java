package ke.kigen.api.repositories.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.user.EUser;

public interface UserDAO extends JpaRepository<EUser, Integer>, JpaSpecificationExecutor<EUser> {
    
}
