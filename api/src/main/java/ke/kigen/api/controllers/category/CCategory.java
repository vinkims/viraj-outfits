package ke.kigen.api.controllers.category;

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
import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.category.ICategory;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/category")
@RequiredArgsConstructor
public class CCategory {
    
    private final ICategory sCategory;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) 
            throws URISyntaxException {

        ECategory category = sCategory.create(categoryDTO);

        return ResponseEntity
            .created(new URI("/" + category.getId()))
            .body(new SuccessResponse(201, "successfully created category", new CategoryDTO(category)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<ECategory> categories = sCategory.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched categories", 
                categories, CategoryDTO.class, ECategory.class));
    }

    @GetMapping(path = "/{categoryId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getCategory(@PathVariable Integer categoryId) {

        ECategory category = sCategory.getById(categoryId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched category", new CategoryDTO(category)));
    }

    @PatchMapping(path = "/{categoryId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateCategory(@PathVariable Integer categoryId, @Valid @RequestBody CategoryDTO categoryDTO) {

        ECategory category = sCategory.update(categoryId, categoryDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated category", new CategoryDTO(category)));
    }
}
