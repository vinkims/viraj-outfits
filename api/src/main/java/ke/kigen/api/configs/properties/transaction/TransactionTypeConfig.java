package ke.kigen.api.configs.properties.transaction;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "transaction-type")
@Data
public class TransactionTypeConfig {
    
    private Integer cancellationId;

    private Integer discountId;

    private Integer exchangeId;

    private Integer expenseId;

    private Integer incomeId;

    private Integer orderId;

    private Integer paymentId;

    private Integer purchaseId;

    private Integer refundId;

    private Integer returnId;

    private Integer saleId;

    public TransactionTypeConfig() {
        setCancellationId(8);
        setDiscountId(9);
        setExchangeId(4);
        setExpenseId(11);
        setIncomeId(10);
        setOrderId(6);
        setPaymentId(7);
        setPurchaseId(1);
        setRefundId(5);
        setReturnId(3);
        setSaleId(2);
    }
}
