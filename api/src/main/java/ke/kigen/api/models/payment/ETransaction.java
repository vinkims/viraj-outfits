package ke.kigen.api.models.payment;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import ke.kigen.api.models.status.EStatus;
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
    @JoinColumn(name = "transaction_type_id", referencedColumnName = "id")
    private ETransactionType transactionType;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;
}
