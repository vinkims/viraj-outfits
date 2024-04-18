package ke.kigen.api.models.contacts;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import ke.kigen.api.models.user.EUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "contacts")
@Data
@NoArgsConstructor
public class EContact implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_type_id", referencedColumnName = "id")
    private EContactType contactType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private EUser user;

    @Id
    @Column(name = "value")
    private String value;
}
