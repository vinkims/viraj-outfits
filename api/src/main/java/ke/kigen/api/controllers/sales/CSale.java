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
import ke.kigen.api.dtos.sales.SaleDTO;
import ke.kigen.api.models.sales.ESale;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.sales.ISale;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/sale")
@RequiredArgsConstructor
public class CSale {
    
    private final ISale sSale;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createSale(@Valid @RequestBody SaleDTO saleDTO) 
            throws URISyntaxException {

        ESale sale = sSale.create(saleDTO);

        return ResponseEntity
            .created(new URI("/" + sale.getId()))
            .body(new SuccessResponse(201, "successfully created sale", new SaleDTO(sale)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<ESale> sales = sSale.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched sales", sales, 
                SaleDTO.class, ESale.class));
    }

    @GetMapping(path = "/{saleId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getSale(@PathVariable Integer saleId) {

        ESale sale = sSale.getById(saleId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched sale", new SaleDTO(sale)));
    }

    @PatchMapping(path = "/{saleId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateSale(@PathVariable Integer saleId, @Valid @RequestBody SaleDTO saleDTO) 
            throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {

        ESale sale = sSale.update(saleId, saleDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated sale", new SaleDTO(sale)));
    }
}
