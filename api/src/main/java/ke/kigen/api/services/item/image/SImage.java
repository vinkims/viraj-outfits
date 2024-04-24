package ke.kigen.api.services.item.image;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ImageDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.item.EImage;
import ke.kigen.api.repositories.item.ImageDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SImage implements IImage {
    
    private final ImageDAO imageDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EImage> buildFilterSpec(String searchQuery) {

        SpecBuilder<EImage> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EImage>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EImage create(ImageDTO imageDTO) {
        EImage image = new EImage();
        image.setCreatedOn(LocalDateTime.now());
        image.setImageData(imageDTO.getImageData());

        save(image);
        return image;
    }

    @Override
    public Optional<EImage> getById(Integer imageId) {
        return imageDAO.findById(imageId);
    }

    @Override
    public EImage getById(Integer imageId, Boolean handleNotFound) {

        Optional<EImage> image = getById(imageId);
        if (!image.isPresent() && handleNotFound) {
            throw new NotFoundException("image with specified id not found", "imageId");
        }
        return image.get();
    }

    @Override
    public Page<EImage> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return imageDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EImage image){
        imageDAO.save(image);
    }

    @Override
    public EImage update(Integer imageId, ImageDTO imageDTO) {
        EImage image = getById(imageId, true);
        image.setImageData(imageDTO.getImageData());
        image.setUpdatedOn(LocalDateTime.now());

        save(image);
        return image;
    }
}
