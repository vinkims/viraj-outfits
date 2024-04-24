package ke.kigen.api.services.item.item_type;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ItemTypeDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.item.EItemType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.item.ItemTypeDAO;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SItemType implements IItemType {

    private final IStatus sStatus;

    private final ItemTypeDAO itemTypeDAO;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EItemType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EItemType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EItemType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return itemTypeDAO.existsByName(name);
    }

    @Override
    public EItemType create(ItemTypeDTO itemTypeDTO) {
        EItemType itemType = new EItemType();
        itemType.setCreatedOn(LocalDateTime.now());
        itemType.setDescription(itemTypeDTO.getDescription());
        itemType.setName(itemTypeDTO.getName());
        Integer statusId = itemTypeDTO.getStatusId() == null
            ? mainConfig.getStatus().getActiveId()
            : itemTypeDTO.getStatusId();
        setStatus(itemType, statusId);

        save(itemType);
        return itemType;
    }

    @Override
    public Optional<EItemType> getById(Integer itemTypeId) {
        return itemTypeDAO.findById(itemTypeId);
    }

    @Override
    public EItemType getById(Integer itemTypeId, Boolean handleNotFound) {

        Optional<EItemType> itemType = getById(itemTypeId);
        if (!itemType.isPresent() && handleNotFound) {
            throw new NotFoundException("item type with specified id not found", "itemTypeId");
        }
        return itemType.get();
    }

    @Override
    public List<EItemType> getFilteredList(String searchQuery) {
        return itemTypeDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EItemType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return itemTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EItemType itemType) {
        itemTypeDAO.save(itemType);
    }

    private void setStatus(EItemType itemType, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        itemType.setStatus(status);
    }

    @Override
    public EItemType update(Integer itemTypeId, ItemTypeDTO itemTypeDTO) {
        EItemType itemType = getById(itemTypeId, true);
        if (itemTypeDTO.getDescription() != null) {
            itemType.setDescription(itemTypeDTO.getDescription());
        }
        if (itemTypeDTO.getName() != null) {
            itemType.setName(itemTypeDTO.getName());
        }
        setStatus(itemType, itemTypeDTO.getStatusId());
        itemType.setUpdatedOn(LocalDateTime.now());

        save(itemType);
        return itemType;
    }
    
}
