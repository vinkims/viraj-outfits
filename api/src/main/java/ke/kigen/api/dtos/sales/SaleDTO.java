package ke.kigen.api.dtos.sales;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.sales.ESale;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SaleDTO {
    
    private Integer id;

    private SaleTypeDTO saleType;

    private Integer saleTypeId;

    private String salesNumber;

    private BigDecimal amount;

    private BigDecimal discount;

    private BigDecimal netAmount;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private ItemDTO item;

    private Integer itemId;

    private CustomerDTO customer;

    private Integer customerId;

    private TransactionDTO transaction;

    private Integer transactionId;

    private UserDTO user;

    private Integer userId;

    private StatusDTO status;

    private Integer statusId;

    public SaleDTO(ESale sale) {
        setAmount(sale.getAmount());
        setCreatedOn(sale.getCreatedOn());
        if (sale.getCustomer() != null) {
            setCustomer(new CustomerDTO(sale.getCustomer()));
        }
        setDiscount(sale.getDiscount());
        setId(sale.getId());
        if (sale.getItem() != null) {
            setItem(new ItemDTO(sale.getItem()));
        }
        setNetAmount(sale.getNetAmount());
        setSalesNumber(sale.getSalesNumber());
        setSaleType(new SaleTypeDTO(sale.getSaleType()));
        if (sale.getStatus() != null) {
            setStatus(new StatusDTO(sale.getStatus()));
        }
        if (sale.getTransaction() != null) {
            setTransaction(new TransactionDTO(sale.getTransaction()));
        }
        setUpdatedOn(sale.getUpdatedOn());
        if (sale.getUser() != null) {
            setUser(new UserDTO(sale.getUser()));
        }
    }
}
