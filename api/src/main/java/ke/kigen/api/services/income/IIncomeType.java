package ke.kigen.api.services.income;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.income.IncomeTypeDTO;
import ke.kigen.api.models.income.EIncomeType;

public interface IIncomeType {
    
    List<String> ALLOWED_FIELDS = List.of();

    Specification<EIncomeType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EIncomeType create(IncomeTypeDTO incomeTypeDTO);

    Optional<EIncomeType> getById(Integer incomeTypeId);

    EIncomeType getById(Integer incomeTypeId, Boolean handleNotFound);

    Page<EIncomeType> getPaginatedList(PageDTO pageDTO);

    void save(EIncomeType incomeType);

    EIncomeType update(Integer incomeTypeId, IncomeTypeDTO incomeTypeDTO);
}
