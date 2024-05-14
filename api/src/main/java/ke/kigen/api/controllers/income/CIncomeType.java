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

import jakarta.validation.Valid;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.income.IncomeTypeDTO;
import ke.kigen.api.models.income.EIncomeType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.income.IIncomeType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/income/type")
@RequiredArgsConstructor
public class CIncomeType {
    
    private final IIncomeType sIncomeType;

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createIncomeType(@Valid @RequestBody IncomeTypeDTO incomeTypeDTO) 
            throws URISyntaxException {

        EIncomeType incomeType = sIncomeType.create(incomeTypeDTO);

        return ResponseEntity
            .created(new URI("/" + incomeType.getId()))
            .body(new SuccessResponse(201, "successfully created income type", new IncomeTypeDTO(incomeType)));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EIncomeType> incomeTypes = sIncomeType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched income types", 
                incomeTypes, IncomeTypeDTO.class, EIncomeType.class));
    }

    @GetMapping(path = "/{incomeTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getIncomeType(@PathVariable Integer incomeTypeId) {

        EIncomeType incomeType = sIncomeType.getById(incomeTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched income type", new IncomeTypeDTO(incomeType)));
    }

    @PatchMapping(path = "/{incomeTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateIncomeType(@PathVariable Integer incomeTypeId, @Valid @RequestBody IncomeTypeDTO incomeTypeDTO) {

        EIncomeType incomeType = sIncomeType.update(incomeTypeId, incomeTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated income type", new IncomeTypeDTO(incomeType)));
    }
}
