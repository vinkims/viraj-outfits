package ke.kigen.api.services.item;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ImageDTO;
import ke.kigen.api.models.item.EImage;

public interface IImage {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "updatedOn"
    );

    Specification<EImage> buildFilterSpec(String searchQuery);

    EImage create(ImageDTO imageDTO);

    Optional<EImage> getById(Integer imageId);

    EImage getById(Integer imageId, Boolean handleNotFound);

    Page<EImage> getPaginatedList(PageDTO pageDTO);

    void save(EImage image);
    
    EImage update(Integer imageId, ImageDTO imageDTO);
}
