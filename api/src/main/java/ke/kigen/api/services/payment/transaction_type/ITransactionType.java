package ke.kigen.api.services.payment.transaction_type;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionTypeDTO;
import ke.kigen.api.models.payment.ETransactionType;

public interface ITransactionType {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<ETransactionType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    ETransactionType create(TransactionTypeDTO transactionTypeDTO);

    Optional<ETransactionType> getById(Integer transactionTypeId);

    ETransactionType getById(Integer transactionTypeId, Boolean handleNotFound);

    List<ETransactionType> getFilteredList(String searchQuery);

    Page<ETransactionType> getPaginatedList(PageDTO pageDTO);

    void save(ETransactionType transactionType);

    ETransactionType update(Integer transactiontypeId, TransactionTypeDTO transactionTypeDTO);
}
