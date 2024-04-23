package ke.kigen.api.services.contact.contact_type;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContactTypeListing extends SBaseContactType implements IContactTypeListing {
    
    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EContactType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EContactType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EContactType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return contactTypeDAO.existsByName(name);
    }

    @Override
    public Optional<EContactType> getById(Integer contactTypeId) {
        return super.getById(contactTypeId);
    }

    @Override
    public EContactType getById(Integer contactTypeId, Boolean handleNotFound) {
        return super.getById(contactTypeId, handleNotFound);
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
}
