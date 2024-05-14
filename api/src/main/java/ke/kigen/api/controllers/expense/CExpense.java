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

import ke.kigen.api.dtos.expense.ExpenseDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.expense.IExpense;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/expense")
@RequiredArgsConstructor
public class CExpense {
    
    private final IExpense sExpense;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createExpense(@RequestBody ExpenseDTO expenseDTO) throws URISyntaxException {

        EExpense expense = sExpense.create(expenseDTO);

        return ResponseEntity
            .created(new URI("/" + expense.getId()))
            .body(new SuccessResponse(201, "successfully created expense", new ExpenseDTO(expense)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        
        Page<EExpense> expenses = sExpense.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched expenses", 
                expenses, ExpenseDTO.class, EExpense.class));
    }

    @GetMapping(path = "/{expenseId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getExpense(@PathVariable Integer expenseId) {

        EExpense expense = sExpense.getById(expenseId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched expense", new ExpenseDTO(expense)));
    }

    @PatchMapping(path = "/{expenseId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateExpense(@PathVariable Integer expenseId, @RequestBody ExpenseDTO expenseDTO) {

        EExpense expense = sExpense.update(expenseId, expenseDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated expense", new ExpenseDTO(expense)));
    }
}
