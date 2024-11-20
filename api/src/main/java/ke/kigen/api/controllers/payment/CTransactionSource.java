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
import ke.kigen.api.dtos.payment.TransactionSourceDTO;
import ke.kigen.api.models.payment.ETransactionSource;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.payment.transaction_source.ITransactionSource;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/transaction/source")
@RequiredArgsConstructor
public class CTransactionSource {
    
    private final ITransactionSource sTransactionSource;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createTransactionSource(@Valid @RequestBody TransactionSourceDTO transactionSourceDTO) 
            throws URISyntaxException {

        ETransactionSource transactionSource = sTransactionSource.create(transactionSourceDTO);

        return ResponseEntity
            .created(new URI("/" + transactionSource.getId()))
            .body(new SuccessResponse(201, "successfully created transaction source", 
                new TransactionSourceDTO(transactionSource)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<ETransactionSource> transactionSources = sTransactionSource.getPaginatedList(pageDTO);
        
        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched transaction sources", transactionSources, 
                TransactionSourceDTO.class, ETransactionSource.class));
    }

    @GetMapping(path = "/{transactionSourceId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getTransactionSource(@PathVariable Integer transactionSourceId) {

        ETransactionSource transactionSource = sTransactionSource.getById(transactionSourceId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched transaction source", 
                new TransactionSourceDTO(transactionSource)));
    }

    @PatchMapping(path = "/{transactionSourceId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateTransactionSource(@PathVariable Integer transactionSourceId, 
            @Valid @RequestBody TransactionSourceDTO transactionSourceDTO) {

        ETransactionSource transactionSource = sTransactionSource.update(transactionSourceId, transactionSourceDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated transaction source", 
                new TransactionSourceDTO(transactionSource)));
    }
}
