package ke.kigen.api.services.expense;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.expense.ExpenseTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.expense.EExpenseType;
import ke.kigen.api.repositories.expense.ExpensTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SExpenseType implements IExpenseType {
    
    private final ExpensTypeDAO expensTypeDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EExpenseType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EExpenseType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EExpenseType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return expensTypeDAO.existsByName(name);
    }

    @Override
    public EExpenseType create(ExpenseTypeDTO expenseTypeDTO) {
        EExpenseType expenseType = new EExpenseType();
        expenseType.setDescription(expenseTypeDTO.getDescription());
        expenseType.setName(expenseTypeDTO.getName());

        save(expenseType);
        return expenseType;
    }

    @Override
    public Optional<EExpenseType> getById(Integer expenseTypeId) {
        return expensTypeDAO.findById(expenseTypeId);
    }

    @Override
    public EExpenseType getById(Integer expenseTypeId, Boolean handleNotFound) {

        Optional<EExpenseType> expenseType = getById(expenseTypeId);
        if (!expenseType.isPresent() && handleNotFound) {
            throw new NotFoundException("expense type with specified id not found", "expenseTypeId");
        }
        return expenseType.get();
    }

    @Override
    public Page<EExpenseType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return expensTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EExpenseType expenseType) {
        expensTypeDAO.save(expenseType);
    }

    @Override
    public EExpenseType update(Integer expenseTypeId, ExpenseTypeDTO expenseTypeDTO) {
        EExpenseType expenseType = getById(expenseTypeId, true);
        if (expenseTypeDTO.getDescription() != null) {
            expenseType.setDescription(expenseTypeDTO.getDescription());
        }
        if (expenseTypeDTO.getName() != null) {
            expenseType.setName(expenseTypeDTO.getName());
        }

        save(expenseType);
        return expenseType;
    }
    
}
