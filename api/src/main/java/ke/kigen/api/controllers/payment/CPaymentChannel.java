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
import ke.kigen.api.dtos.payment.PaymentChannelDTO;
import ke.kigen.api.models.payment.EPaymentChannel;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.payment.payment_channel.IPaymentChannel;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/payment/channel")
@RequiredArgsConstructor
public class CPaymentChannel {
    
    private final IPaymentChannel sPaymentChannel;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createPaymentChannel(@Valid @RequestBody PaymentChannelDTO paymentChannelDTO) 
            throws URISyntaxException {

        EPaymentChannel paymentChannel = sPaymentChannel.create(paymentChannelDTO);

        return ResponseEntity
            .created(new URI("/" + paymentChannel.getId()))
            .body(new SuccessResponse(201, "successfully created payment channel", 
                new PaymentChannelDTO(paymentChannel)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EPaymentChannel> paymentChannels = sPaymentChannel.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched payment channels", paymentChannels, 
                PaymentChannelDTO.class, EPaymentChannel.class));
    }

    @GetMapping(path = "/{paymentChannelId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getPaymentChannel(@PathVariable Integer paymentChannelId) {

        EPaymentChannel paymentChannel = sPaymentChannel.getById(paymentChannelId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched payment channels", 
                new PaymentChannelDTO(paymentChannel)));
    }

    @PatchMapping(path = "/{paymentChannelId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updatePaymentChannel(@PathVariable Integer paymentChannelId, 
            @Valid @RequestBody PaymentChannelDTO paymentChannelDTO) {

        EPaymentChannel paymentChannel = sPaymentChannel.update(paymentChannelId, paymentChannelDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated payment channel", 
                new PaymentChannelDTO(paymentChannel)));
    }
}
