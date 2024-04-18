package ke.kigen.api.services.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SUserListing extends SBaseUser implements IUserListing {

    private final SpecFactory specFactory;
    
    @Override
    public Specification<EUser> buildFilterSpec(String searchQuery) {

        SpecBuilder<EUser> specBuilder = new SpecBuilder();

        specBuilder = (SpecBuilder<EUser>) specFactory.generateSpecification(searchQuery, 
            specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Optional<EUser> getByContactValue(String contactValue) {
        return super.getByContactValue(contactValue);
    }

    @Override
    public Optional<EUser> getById(Integer userId) {
        return super.getById(userId);
    }

    @Override
    public EUser getById(Integer userId, Boolean handleNotFound) {
        return super.getById(userId, handleNotFound);
    }

    @Override
    public Optional<EUser> getByIdOrContactValue(String userValue) {
        return super.getByContactValue(userValue);
    }

    @Override
    public EUser getByIdOrContactValue(String userValue, Boolean handleNotFound) {
        return super.getByIdOrContactValue(userValue, handleNotFound);
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
}
