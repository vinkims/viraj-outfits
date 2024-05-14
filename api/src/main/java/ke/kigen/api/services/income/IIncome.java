package ke.kigen.api.services.income;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.income.IncomeDTO;
import ke.kigen.api.models.income.EIncome;

public interface IIncome {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "amount",
        "createdOn",
        "incomeType.id",
        "incomeType.name",
        "status.id",
        "status.name",
        "updatedOn",
        "user.id"
    );

    Specification<EIncome> buildFilterSpec(String searchQuery);

    EIncome create(IncomeDTO incomeDTO);

    Optional<EIncome> getById(Integer incomeId);

    EIncome getById(Integer incomeId, Boolean handleNotFound);

    List<EIncome> getFilteredList(String searchQuery);

    Page<EIncome> getPaginatedList(PageDTO pageDTO);

    void save(EIncome income);

    EIncome update(Integer incomeId, IncomeDTO incomeDTO);
}
