package ke.kigen.api.services.category;

import java.util.Optional;
import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.repositories.category.CategoryDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseCategory {
    
    protected final CategoryDAO categoryDAO;

    public SBaseCategory() {
        this.categoryDAO = null;
    }

    protected Optional<ECategory> getById(Integer categoryId) {
        return categoryDAO.findById(categoryId);
    }

    protected ECategory getById(Integer categoryId, Boolean handleNotFound) {

        Optional<ECategory> category = getById(categoryId);
        if (!category.isPresent() && handleNotFound) {
            throw new NotFoundException("category with specified id not found", "categoryId");
        }
        return category.get();
    }

    protected void save(ECategory category) {
        categoryDAO.save(category);
    }
}
