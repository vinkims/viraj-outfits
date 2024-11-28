package ke.kigen.api.models.sales;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.io.Serializable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "sale_types")
@Data
@NoArgsConstructor
public class ESaleType implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "description")
    private String descrition;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
}
