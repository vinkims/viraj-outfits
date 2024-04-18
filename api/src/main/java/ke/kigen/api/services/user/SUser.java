package ke.kigen.api.services.user;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SUser implements IUserCreate, IUserListing, IUserUpdate {

    private final IUserCreate sUserCreate;

    private final IUserListing sUserListing;

    private final IUserUpdate sUserUpdate;
    
    @Override
    public Specification<EUser> buildFilterSpec(String searchQuery) {
        return sUserListing.buildFilterSpec(searchQuery);
    }

    @Override
    public EUser create(UserDTO userDTO) {
        return sUserCreate.create(userDTO);
    }

    @Override
    public Optional<EUser> getByContactValue(String contactValue) {
        return sUserListing.getByContactValue(contactValue);
    }

    @Override
    public Optional<EUser> getById(Integer userId) {
        return sUserListing.getById(userId);
    }

    @Override
    public EUser getById(Integer userId, Boolean handleNotFound) {
        return sUserListing.getById(userId, handleNotFound);
    }

    @Override
    public Optional<EUser> getByIdOrContactValue(String userValue) {
        return sUserListing.getByIdOrContactValue(userValue);
    }

    @Override
    public EUser getByIdOrContactValue(String userValue, Boolean handleNotFound) {
        return sUserListing.getByIdOrContactValue(userValue, handleNotFound);
    }

    @Override
    public List<EUser> getFilteredList(String searchQuery) {
        return sUserListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<EUser> getPaginatedList(PageDTO pageDTO) {
        return sUserListing.getPaginatedList(pageDTO);
    }

    @Override
    public EUser update(String userValue, UserDTO userDTO) throws IllegalAccessException, IllegalArgumentException, 
            InvocationTargetException, NoSuchMethodException, SecurityException {
        return sUserUpdate.update(userValue, userDTO);
    }
    
}
