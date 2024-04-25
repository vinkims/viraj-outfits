package ke.kigen.api.controllers.order;

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

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderDTO;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.order.IOrder;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/order")
@RequiredArgsConstructor
public class COrder {
    
    private final IOrder sOrder;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createOrder(@RequestBody OrderDTO orderDTO) throws URISyntaxException {

        EOrder order = sOrder.create(orderDTO);

        return ResponseEntity
            .created(new URI("/" + order.getId()))
            .body(new SuccessResponse(201, "successfully created order", new OrderDTO(order)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EOrder> orders = sOrder.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched orders", orders, 
                OrderDTO.class, EOrder.class));
    }

    @GetMapping(path = "/{orderId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getOrder(@PathVariable Integer orderId) {

        EOrder order = sOrder.getById(orderId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched order", new OrderDTO(order)));
    }

    @PatchMapping(path = "/{orderId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateOrder(@PathVariable Integer orderId, @RequestBody OrderDTO orderDTO) {

        EOrder order = sOrder.getById(orderId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated order", new OrderDTO(order)));
    }
}
