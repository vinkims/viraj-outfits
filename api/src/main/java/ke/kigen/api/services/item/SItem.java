package ke.kigen.api.services.item;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
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
import ke.kigen.api.dtos.item.ImageDTO;
import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.models.item.EImage;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.item.EItemType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.item.ItemDAO;
import ke.kigen.api.services.category.ICategory;
import ke.kigen.api.services.item.image.IImage;
import ke.kigen.api.services.item.item_type.IItemType;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SItem implements IItem {

    private final ICategory sCategory;

    private final IImage sImage;

    private final IItemType sItemType;

    private final IStatus sStatus;

    private final ItemDAO itemDAO;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<EItem> buildFilterSpec(String searchQuery) {

        SpecBuilder<EItem> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EItem>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EItem create(ItemDTO itemDTO) {
        EItem item = new EItem();
        setCategory(item, itemDTO.getCategoryId());
        item.setColor(itemDTO.getColor());
        item.setCreatedOn(LocalDateTime.now());
        setImage(item, itemDTO.getImage());
        setItemType(item, itemDTO.getItemTypeId());
        item.setName(itemDTO.getName());
        item.setPrice(itemDTO.getPrice());
        item.setSize(itemDTO.getSize());
        Integer statusId = itemDTO.getStatusId() == null
            ? mainConfig.getStatus().getInStockId()
            : itemDTO.getStatusId();
        setStatus(item, statusId);

        save(item);
        return item;
    }

    @Override
    public Optional<EItem> getById(Integer itemId) {
        return itemDAO.findById(itemId);
    }

    @Override
    public EItem getById(Integer itemId, Boolean handleNotFound) {

        Optional<EItem> item = getById(itemId);
        if (!item.isPresent() && handleNotFound) {
            throw new NotFoundException("item with specified id not found", "itemId");
        }
        return item.get();
    }

    @Override
    public List<EItem> getFilteredList(String searchQuery) {
        return itemDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EItem> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return itemDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EItem item) {
        itemDAO.save(item);
    }

    private void setCategory(EItem item, Integer categoryId) {
        if (categoryId == null) { return; }

        ECategory category = sCategory.getById(categoryId, true);
        item.setCategory(category);
    }

    private void setImage(EItem item, ImageDTO imageDTO) {
        if (imageDTO == null) { return; }

        EImage image = sImage.create(imageDTO);
        item.setImage(image);
    }

    private void setItemType(EItem item, Integer itemTypeId) {
        if (itemTypeId == null) { return; }

        EItemType itemType = sItemType.getById(itemTypeId, true);
        item.setItemType(itemType);
    }

    private void setStatus(EItem item, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        item.setStatus(status);
    }

    @Override
    public EItem update(Integer itemId, ItemDTO itemDTO) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EItem item = getById(itemId, true);

        String[] fields = {"Color", "Name", "Price", "Size"};
        for (String field : fields) {
            Method getField = ItemDTO.class.getMethod(String.format("get%s",field));
            Object fieldValue = getField.invoke(itemDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                EItem.class.getMethod("set" + field, fieldValue.getClass()).invoke(item, fieldValue);
            }
        }

        setCategory(item, itemDTO.getCategoryId());
        setImage(item, itemDTO.getImage());
        setItemType(item, itemDTO.getItemTypeId());
        setStatus(item, itemDTO.getStatusId());

        save(item);
        return item;
    }
    
}
