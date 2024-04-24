package ke.kigen.api.controllers.item;

import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.InventoryDTO;
import ke.kigen.api.models.item.EInventory;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.item.IInventory;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/item/inventory")
@RequiredArgsConstructor
public class CInventory {
    
    private final IInventory sInventory;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createInventory(@RequestBody InventoryDTO inventoryDTO) 
            throws URISyntaxException {

        EInventory inventory = sInventory.create(inventoryDTO);

        return ResponseEntity
            .created(new URI("/" + inventory.getId()))
            .body(new SuccessResponse(201, "successfully created inventory", new InventoryDTO(inventory)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EInventory> inventories = sInventory.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched inventories", inventories, 
                InventoryDTO.class, EInventory.class));
    }

    @GetMapping(path = "/{inventoryId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getInventory(@PathVariable Integer inventoryId) {

        EInventory inventory = sInventory.getById(inventoryId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched inventory", new InventoryDTO(inventory)));
    }
}
