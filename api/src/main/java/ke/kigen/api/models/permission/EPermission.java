package ke.kigen.api.models.permission;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "permissions")
@Data
@NoArgsConstructor
public class EPermission implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @Column(name = "method")
    private String method;

    @Column(name = "name")
    private String name;

    @Column(name = "resource")
    private String resource;
    
    @Column(name = "updated_on")
    private LocalDateTime updatedOn;
}
