package ke.kigen.api.controllers.expense;

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
import ke.kigen.api.dtos.expense.ExpenseTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.expense.EExpenseType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.expense.IExpenseType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/expense/type")
@RequiredArgsConstructor
public class CExpenseType {
    
    private final IExpenseType sExpenseType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createExpenseType(@Valid @RequestBody ExpenseTypeDTO expenseTypeDTO) 
            throws URISyntaxException {

        EExpenseType expenseType = sExpenseType.create(expenseTypeDTO);

        return ResponseEntity
            .created(new URI("/" + expenseType.getId()))
            .body(new SuccessResponse(201, "successfully created expense type", new ExpenseTypeDTO(expenseType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EExpenseType> expenseTypes = sExpenseType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched expense types", 
                expenseTypes, ExpenseTypeDTO.class, EExpenseType.class));
    }

    @GetMapping(path = "/{expenseTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getExpenseType(@PathVariable Integer expenseTypeId) {

        EExpenseType expenseType = sExpenseType.getById(expenseTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched expense", new ExpenseTypeDTO(expenseType)));
    }

    @PatchMapping(path = "/{expenseTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateExpenseType(@PathVariable Integer expenseTypeId, 
            @Valid @RequestBody ExpenseTypeDTO expenseTypeDTO) {

        EExpenseType expenseType = sExpenseType.update(expenseTypeId, expenseTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated expense type", new ExpenseTypeDTO(expenseType)));
    }
}
