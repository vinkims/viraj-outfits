package ke.kigen.api.controllers.sales;

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
import ke.kigen.api.dtos.sales.SaleTypeDTO;
import ke.kigen.api.models.sales.ESaleType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.sales.ISaleType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/sale/type")
@RequiredArgsConstructor
public class CSaleType {
    
    private final ISaleType sSaleType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createSaleType(@Valid @RequestBody SaleTypeDTO saleTypeDTO) 
            throws URISyntaxException {
        
        ESaleType saleType = sSaleType.create(saleTypeDTO);

        return ResponseEntity
            .created(new URI("/" + saleType.getId()))
            .body(new SuccessResponse(201, "successfully created sale type", new SaleTypeDTO(saleType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<ESaleType> saleTypes = sSaleType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched sale types", saleTypes, 
                SaleTypeDTO.class, ESaleType.class));
    }

    @GetMapping(path = "/{saleTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getSaleType(@PathVariable Integer saleTypeId) {

        ESaleType saleType = sSaleType.getById(saleTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched sale type", new SaleTypeDTO(saleType)));
    }

    @PatchMapping(path = "/{saleTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateSaleType(@PathVariable Integer saleTypeId, 
            @Valid @RequestBody SaleTypeDTO saleTypeDTO) {

        ESaleType saleType = sSaleType.update(saleTypeId, saleTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated sale type", new SaleTypeDTO(saleType)));
    }
}
