package ke.kigen.api.services.payment.transaction_source;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionSourceDTO;
import ke.kigen.api.models.payment.ETransactionSource;

public interface ITransactionSource {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<ETransactionSource> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    ETransactionSource create(TransactionSourceDTO transactionSourceDTO);

    Optional<ETransactionSource> getById(Integer transactionSourceId);

    ETransactionSource getById(Integer transactionSourceId, Boolean handleNotFound);

    List<ETransactionSource> getFilteredList(String searchQuery);

    Page<ETransactionSource> getPaginatedList(PageDTO pageDTO);

    void save(ETransactionSource transactionSource);

    ETransactionSource update(Integer transactionSourceId, TransactionSourceDTO transactionSourceDTO);
}
