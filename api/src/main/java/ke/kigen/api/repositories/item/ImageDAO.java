package ke.kigen.api.repositories.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.item.EImage;

public interface ImageDAO extends JpaRepository<EImage, Integer>, JpaSpecificationExecutor<EImage> {
    
}
