package ke.kigen.api.services.sales;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.sales.SaleDTO;
import ke.kigen.api.models.sales.ESale;

public interface ISale {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "amount",
        "createdOn",
        "customer.id",
        "discount",
        "item.id",
        "item.itemNumber",
        "item.itemType.id",
        "item.itemType.name",
        "netAmount",
        "reference",
        "paymentChannel.id",
        "paymentChannel.name",
        "salesNumber",
        "salesType.id",
        "salesType.name",
        "status.id",
        "status.name",
        "transaction.id",
        "transaction.transactionCode",
        "updatedOn",
        "user.id"
    );

    Specification<ESale> buildFilterSpec(String searchQuery);

    Boolean checkExistsBySalesNumber(String salesNumber);

    ESale create(SaleDTO saleDTO);

    Optional<ESale> getById(Integer saleId);

    ESale getById(Integer saleId, Boolean handleNotFound);

    Optional<ESale> getBySalesNumber(String salesNumber);

    ESale getBySalesNumber(String salesNumber, Boolean handleNotFound);

    List<ESale> getFilteredList(String searchQuery);

    Page<ESale> getPaginatedList(PageDTO pageDTO);

    void save(ESale sale);

    ESale update(Integer saleTypeId, SaleDTO saleDTO) throws NoSuchMethodException, 
        SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException;
}
