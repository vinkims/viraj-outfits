package ke.kigen.api.configs.properties.transaction;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "type")
@Data
public class TypeConfig {
    
    private Integer cancellationId;

    private Integer cashbackId;

    private Integer deliveryFeeId;

    private Integer discountId;

    private Integer exchangeId;

    private Integer expenseId;

    private Integer incomeId;

    private Integer orderId;

    private Integer paymentId;

    private Integer purchaseId;

    private Integer refundId;

    private Integer restockId;

    private Integer returnId;

    private Integer saleId;

    private Integer serviceFeeId;

    private Integer stockAdjustmentId;

    private Integer taxPaymentId;

    public TypeConfig() {
        setCancellationId(8);
        setCashbackId(16);
        setDeliveryFeeId(14);
        setDiscountId(9);
        setExchangeId(4);
        setExpenseId(11);
        setIncomeId(10);
        setOrderId(6);
        setPaymentId(7);
        setPurchaseId(1);
        setRefundId(5);
        setRestockId(13);
        setReturnId(3);
        setSaleId(2);
        setServiceFeeId(15);
        setStockAdjustmentId(12);
        setTaxPaymentId(17);
    }
}
