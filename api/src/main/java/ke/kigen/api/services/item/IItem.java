package ke.kigen.api.services.item;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.models.item.EItem;

public interface IItem {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "category.id",
        "category.name",
        "color",
        "createdOn",
        "image.id",
        "itemType.id",
        "itemType.name",
        "price",
        "size",
        "updatedOn"
    );

    Specification<EItem> buildFilterSpec(String searchQuery);

    EItem create(ItemDTO itemDTO);

    Optional<EItem> getById(Integer itemId);

    EItem getById(Integer itemId, Boolean handleNotFound);

    List<EItem> getFilteredList(String searchQuery);

    Page<EItem> getPaginatedList(PageDTO pageDTO);

    void save(EItem item);

    EItem update(Integer itemId, ItemDTO itemDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
