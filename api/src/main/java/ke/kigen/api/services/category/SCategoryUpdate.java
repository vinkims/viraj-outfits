package ke.kigen.api.services.category;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.models.category.ECategory;

@Service
public class SCategoryUpdate extends SBaseCategory implements ICategoryUpdate {

    @Override
    public ECategory update(Integer categoryId, CategoryDTO categoryDTO) {
        ECategory category = getById(categoryId, true);
        if (categoryDTO.getDescription() != null) {
            category.setDescription(categoryDTO.getDescription());
        }
        if (categoryDTO.getName() != null) {
            category.setName(categoryDTO.getName());
        }

        save(category);
        return category;
    }
    
}
