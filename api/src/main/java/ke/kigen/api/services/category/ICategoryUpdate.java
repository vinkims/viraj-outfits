package ke.kigen.api.services.category;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.models.category.ECategory;

public interface ICategoryUpdate {
    
    ECategory update(Integer categoryId, CategoryDTO categoryDTO);
}
