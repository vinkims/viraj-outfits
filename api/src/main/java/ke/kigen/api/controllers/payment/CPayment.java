package ke.kigen.api.controllers.payment;

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
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.PaymentDTO;
import ke.kigen.api.models.payment.EPayment;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.payment.IPayment;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/payment")
@RequiredArgsConstructor
public class CPayment {
    
    private final IPayment sPayment;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createPayment(@Valid @RequestBody PaymentDTO paymentDTO) 
            throws URISyntaxException {

        EPayment payment = sPayment.create(paymentDTO);

        return ResponseEntity
            .created(new URI("/" + payment.getId()))
            .body(new SuccessResponse(201, "successfully created payment", new PaymentDTO(payment)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EPayment> payments = sPayment.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched payments", payments, 
                PaymentDTO.class, EPayment.class));
    }

    @GetMapping(path = "/{paymentValue}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getPayment(@PathVariable String paymentValue) {

        EPayment payment = sPayment.getByIdOrExternalId(paymentValue, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched payment", new PaymentDTO(payment)));
    }

    @PatchMapping(path = "/{paymentValue}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updatePayment(@PathVariable String paymentValue, @Valid @RequestBody PaymentDTO paymentDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EPayment payment = sPayment.update(paymentValue, paymentDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated payment", new PaymentDTO(payment)));
    }
}
