package ke.kigen.api.controllers.income;

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
import ke.kigen.api.dtos.income.IncomeDTO;
import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.income.IIncome;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/income")
@RequiredArgsConstructor
public class CIncome {
    
    private final IIncome sIncome;

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createIncome(@RequestBody IncomeDTO incomeDTO) 
            throws URISyntaxException {

        EIncome income = sIncome.create(incomeDTO);

        return ResponseEntity
            .created(new URI("/" + income.getId()))
            .body(new SuccessResponse(201, "successfully created income", new IncomeDTO(income)));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EIncome> incomes = sIncome.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched incomes", 
                incomes, IncomeDTO.class, EIncome.class));
    }

    @GetMapping(path = "/{incomeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getIncome(@PathVariable Integer incomeId) {

        EIncome income = sIncome.getById(incomeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched income", new IncomeDTO(income)));
    }

    @PatchMapping(path = "/{incomeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateIncome(@PathVariable Integer incomeId, @RequestBody IncomeDTO incomeDTO) {

        EIncome income = sIncome.update(incomeId, incomeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated income", new IncomeDTO(income)));
    }
}
