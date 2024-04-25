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
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.payment.transaction.ITransaction;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/transaction")
@RequiredArgsConstructor
public class CTransaction {
    
    private final ITransaction sTransaction;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) 
            throws URISyntaxException {

        ETransaction transaction = sTransaction.create(transactionDTO);

        return ResponseEntity
            .created(new URI("/" + transaction.getId()))
            .body(new SuccessResponse(201, "successfully created transaction", new TransactionDTO(transaction)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<ETransaction> transactions = sTransaction.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched transactions", transactions, 
                TransactionDTO.class, ETransaction.class));
    }

    @GetMapping(path = "/{transactionValue}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getTransaction(@PathVariable String transactionValue) {

        ETransaction transaction = sTransaction.getByIdOrTransactionCode(transactionValue, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched transaction", new TransactionDTO(transaction)));
    }

    @PatchMapping(path = "/{transactionValue}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateTransaction(@PathVariable String transactionValue, @Valid @RequestBody TransactionDTO transactionDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ETransaction transaction = sTransaction.update(transactionValue, transactionDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated transaction", new TransactionDTO(transaction)));
    }
}
