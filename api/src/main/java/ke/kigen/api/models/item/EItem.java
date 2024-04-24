package ke.kigen.api.models.item;

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
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.models.status.EStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "items")
@Data
@NoArgsConstructor
public class EItem implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private ECategory category;

    @Column(name = "color")
    private String color;

    @Column(name="created_on")
    private LocalDateTime createdOn;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private EImage image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_type_id", referencedColumnName = "id")
    private EItemType itemType;

    @Column(name = "name")
    private String name;

    @Column(name= "price")
    private BigDecimal price;

    @Column(name = "size")
    private String size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", referencedColumnName = "id")
    private EStatus status;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;
}
