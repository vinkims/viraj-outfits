package ke.kigen.api.services.payment.transaction;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.models.payment.ETransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

public interface ITransaction {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "amount",
        "createdOn",
        "paymentChannel.id",
        "paymentChannel.name",
        "status.id",
        "status.name",
        "transactionCode",
        "transactionSource.id",
        "transactionSource.name",
        "transactionType.id",
        "transactionType.name",
        "updatedOn",
        "user.id"
    );

    Specification<ETransaction> buildFilterSpec(String searchQuery);

    Boolean checkExistsByTransactionCode(String transactionCode);

    ETransaction create(TransactionDTO transactionDTO);

    Optional<ETransaction> getById(Integer transactionId);

    ETransaction getById(Integer transactionId, Boolean handleNotFound);

    Optional<ETransaction> getByIdOrTransactionCode(String transactionValue);

    ETransaction getByIdOrTransactionCode(String transactionValue, Boolean handleNotFound);

    Optional<ETransaction> getByTransactionCode(String transactionCode);

    List<ETransaction> getFilteredList(String searchQuery);

    Page<ETransaction> getPaginatedList(PageDTO pageDTO);

    void save(ETransaction transaction);

    ETransaction update(String transactionValue, TransactionDTO transactionDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
