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

import jakarta.validation.Valid;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderTypeDTO;
import ke.kigen.api.models.order.EOrderType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.order.IOrderType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/order/type")
@RequiredArgsConstructor
public class COrderType {
    
    private final IOrderType sOrderType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createOrderType(@Valid @RequestBody OrderTypeDTO orderTypeDTO) 
            throws URISyntaxException {

        EOrderType orderType = sOrderType.create(orderTypeDTO);

        return ResponseEntity
            .created(new URI("/" + orderType.getId()))
            .body(new SuccessResponse(201, "successfully created order type", new OrderTypeDTO(orderType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EOrderType> orderTypes = sOrderType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched order types", orderTypes, 
                OrderTypeDTO.class, EOrderType.class));
    }

    @GetMapping(path = "/{orderTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getOrderType(@PathVariable Integer orderTypeId) {

        EOrderType orderType = sOrderType.getById(orderTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched order type", new OrderTypeDTO(orderType)));
    }

    @PatchMapping(path = "/{orderTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateOrderType(@PathVariable Integer orderTypeId, @Valid @RequestBody OrderTypeDTO orderTypeDTO) {

        EOrderType orderType = sOrderType.update(orderTypeId, orderTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated order type", new OrderTypeDTO(orderType)));
    }
}
