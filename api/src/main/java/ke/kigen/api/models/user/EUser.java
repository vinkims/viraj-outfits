package ke.kigen.api.models.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.status.EStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity(name = "users")
@Data
@NoArgsConstructor
public class EUser implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<EContact> contacts;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "first_name")
    private String firstName;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id")
    private Integer id;

    @Column(name = "last_active_on")
    private LocalDateTime lastActiveOn;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "password")
    private String password;

    @Column(name = "password_reset")
    private Boolean passwordReset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private ERole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", referencedColumnName = "id")
    private EStatus status;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    public void setPassword(String passcode) {
        if (passcode != null) {
            password = new BCryptPasswordEncoder().encode(passcode);
        }
    }
}
