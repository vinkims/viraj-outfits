package ke.kigen.api.services.income;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.income.IncomeTypeDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.income.EIncomeType;
import ke.kigen.api.repositories.income.IncomeTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SIncomeType implements IIncomeType {
    
    private final IncomeTypeDAO incomeTypeDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EIncomeType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EIncomeType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EIncomeType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return incomeTypeDAO.existsByName(name);
    }

    @Override
    public EIncomeType create(IncomeTypeDTO incomeTypeDTO) {
        EIncomeType incomeType = new EIncomeType();
        incomeType.setDescription(incomeTypeDTO.getDescription());
        incomeType.setName(incomeTypeDTO.getName());

        save(incomeType);
        return incomeType;
    }

    @Override
    public Optional<EIncomeType> getById(Integer incomeTypeId) {
        return incomeTypeDAO.findById(incomeTypeId);
    }

    @Override
    public EIncomeType getById(Integer incomeTypeId, Boolean handleNotFound) {
        
        Optional<EIncomeType> incomeType = getById(incomeTypeId);
        if (!incomeType.isPresent() && handleNotFound) {
            throw new NotFoundException("income type with specified id not found", "incomeTypeId");
        }
        return incomeType.get();
    }

    @Override
    public Page<EIncomeType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return incomeTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EIncomeType incomeType) {
        incomeTypeDAO.save(incomeType);
    }

    @Override
    public EIncomeType update(Integer incomeTypeId, IncomeTypeDTO incomeTypeDTO) {
        EIncomeType incomeType = getById(incomeTypeId, true);
        if (incomeTypeDTO.getDescription() != null) {
            incomeType.setDescription(incomeTypeDTO.getDescription());
        }
        if (incomeTypeDTO.getName() != null) {
            incomeType.setName(incomeTypeDTO.getName());
        }

        save(incomeType);
        return incomeType;
    }
}
