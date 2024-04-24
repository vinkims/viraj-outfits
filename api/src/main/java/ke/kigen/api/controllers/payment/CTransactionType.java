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
import ke.kigen.api.dtos.payment.TransactionTypeDTO;
import ke.kigen.api.models.payment.ETransactionType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.payment.transaction_type.ITransactionType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/transaction/type")
@RequiredArgsConstructor
public class CTransactionType {
    
    private final ITransactionType sTransactionType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createTransactionType(@Valid @RequestBody TransactionTypeDTO transactionTypeDTO) 
            throws URISyntaxException {

        ETransactionType transactionType = sTransactionType.create(transactionTypeDTO);

        return ResponseEntity
            .created(new URI("/" + transactionType.getId()))
            .body(new SuccessResponse(200, "successfully created transaction type", 
                new TransactionTypeDTO(transactionType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<ETransactionType> transactionTypes = sTransactionType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched transaction types", transactionTypes, 
                TransactionTypeDTO.class, ETransactionType.class));
    }

    @GetMapping(path = "/{transactionTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getTransactionType(@PathVariable Integer transactionTypeId) {

        ETransactionType transactionType = sTransactionType.getById(transactionTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched transaction type", 
                new TransactionTypeDTO(transactionType)));
    }

    @PatchMapping(path = "/{transactionTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateTransactionType(@PathVariable Integer transactionTypeId, 
            @Valid @RequestBody TransactionTypeDTO transactionTypeDTO) {

        ETransactionType transactionType = sTransactionType.update(transactionTypeId, transactionTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated transaction type", 
                new TransactionTypeDTO(transactionType)));
    }
}
