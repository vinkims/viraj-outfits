package ke.kigen.api.models.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.models.status.EStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "payments")
@Data
@NoArgsConstructor
public class EPayment implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "amount")
    private BigDecimal amount;
    
    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "description")
    private String description;
    
    @Column(name = "external_id")
    private String externalId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @Column(name = "reference")
    private String reference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private EOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_channel_id", referencedColumnName = "id")
    private EPaymentChannel paymentChannel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="status_id", referencedColumnName = "id")
    private EStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    private ETransaction transaction;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;
}
