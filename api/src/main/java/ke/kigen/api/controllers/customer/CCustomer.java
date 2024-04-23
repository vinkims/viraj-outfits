package ke.kigen.api.controllers.customer;

import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.customer.ICustomer;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/customer")
@RequiredArgsConstructor
public class CCustomer {
    
    private final ICustomer sCustomer;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) 
            throws URISyntaxException {

        ECustomer customer = sCustomer.create(customerDTO);

        return ResponseEntity
            .created(new URI("/" + customer.getId()))
            .body(new SuccessResponse(201, "successfully created customer", new CustomerDTO(customer)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<ECustomer> customers = sCustomer.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched customers", customers, 
                CustomerDTO.class, ECustomer.class));
    }

    @GetMapping(path = "/{customerId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getCustomer(@PathVariable Integer customerId) {

        ECustomer customer = sCustomer.getById(customerId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched customer", new CustomerDTO(customer)));
    }

    @PatchMapping(path = "/{customerId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateCustomer(@PathVariable Integer customerId, @Valid @RequestBody CustomerDTO customerDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ECustomer customer = sCustomer.update(customerId, customerDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated customer", new CustomerDTO(customer)));
    }
}
