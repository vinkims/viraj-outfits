package ke.kigen.api.models.payment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "transactions")
@Data
@NoArgsConstructor
public class ETransaction implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "description")
    private String description;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_channel_id", referencedColumnName = "id")
    private EPaymentChannel paymentChannel;

    @Column(name = "reference")
    private String reference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", referencedColumnName = "id")
    private EStatus status;

    @Column(name = "transaction_code")
    private String transactionCode;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY)
    private ETransactionExpense transactionExpense;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY)
    private ETransactionIncome transactionIncome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_source_id", referencedColumnName = "id")
    private ETransactionSource transactionSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_type_id", referencedColumnName = "id")
    private ETransactionType transactionType;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private ETransactionItem transactionItem;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private EUser user;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY)
    private ECustomerTransaction customerTransaction;
}
