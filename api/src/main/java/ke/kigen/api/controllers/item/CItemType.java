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
import ke.kigen.api.dtos.item.ItemTypeDTO;
import ke.kigen.api.models.item.EItemType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.item.item_type.IItemType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/item/type")
@RequiredArgsConstructor
public class CItemType {
    
    private final IItemType sItemType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createItemType(@Valid @RequestBody ItemTypeDTO itemTypeDTO) 
            throws URISyntaxException {

        EItemType itemType = sItemType.create(itemTypeDTO);

        return ResponseEntity
            .created(new URI("/" + itemType.getId()))
            .body(new SuccessResponse(201, "successfully created item type", new ItemTypeDTO(itemType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EItemType> itemTypes = sItemType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched item types", itemTypes, 
                ItemTypeDTO.class, EItemType.class));
    }

    @GetMapping(path = "/{itemTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getItemType(@PathVariable Integer itemTypeId) {

        EItemType itemType = sItemType.getById(itemTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched item type", new ItemTypeDTO(itemType)));
    }

    @PatchMapping(path = "/{itemTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateItemType(@PathVariable Integer itemTypeId, @Valid @RequestBody ItemTypeDTO itemTypeDTO) {

        EItemType itemType = sItemType.update(itemTypeId, itemTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated item type", new ItemTypeDTO(itemType)));
    }
}
