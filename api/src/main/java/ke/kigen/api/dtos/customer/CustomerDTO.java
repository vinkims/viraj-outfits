package ke.kigen.api.dtos.customer;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.annotations.IsCustomerEmailDuplicate;
import ke.kigen.api.annotations.IsCustomerMobileDuplicate;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.customer.ECustomer;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class CustomerDTO {
    
    private Integer id;

    private String firstName;

    private String lastName;

    @IsCustomerEmailDuplicate
    private String email;

    @IsCustomerMobileDuplicate
    private String mobileNumber;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public CustomerDTO(ECustomer customer) {
        setCreatedOn(customer.getCreatedOn());
        setEmail(customer.getEmail());
        setFirstName(customer.getFirstName());
        setId(customer.getId());
        setLastName(customer.getLastName());
        setMobileNumber(customer.getMobileNumber());
        setStatus(new StatusDTO(customer.getStatus()));
        setUpdatedOn(customer.getUpdatedOn());
    }
}
