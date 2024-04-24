package ke.kigen.api.controllers.item;

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
import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.item.IItem;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/item")
@RequiredArgsConstructor
public class CItem {
    
    private final IItem sItem;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createItem(@Valid @RequestBody ItemDTO itemDTO) 
            throws URISyntaxException {

        EItem item = sItem.create(itemDTO);

        return ResponseEntity
            .created(new URI("/" + item.getId()))
            .body(new SuccessResponse(201, "successfully created item", new ItemDTO(item)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EItem> items = sItem.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched items", items, 
                ItemDTO.class, EItem.class));
    }

    @GetMapping(path = "/{itemId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getItem(@PathVariable Integer itemId) {

        EItem item = sItem.getById(itemId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched item", new ItemDTO(item)));
    }

    @PatchMapping(path = "/{itemId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateItem(@PathVariable Integer itemId, @Valid @RequestBody ItemDTO itemDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, 
            SecurityException {

        EItem item = sItem.update(itemId, itemDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated item", new ItemDTO(item)));
    }
}
