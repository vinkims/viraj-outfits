package ke.kigen.api.repositories.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.auth.EBlacklistToken;

public interface BlacklistTokenDAO extends JpaRepository<EBlacklistToken, Integer> {
    
    Boolean existsByTokenHash(Integer tokenHash);
}
