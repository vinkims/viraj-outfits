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

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ImageDTO;
import ke.kigen.api.models.item.EImage;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.item.IImage;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/item/image")
@RequiredArgsConstructor
public class CImage {
    
    private final IImage sImage;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createImage(@RequestBody ImageDTO imageDTO) 
            throws URISyntaxException {

        EImage image = sImage.create(imageDTO);

        return ResponseEntity
            .created(new URI("/" + image.getId()))
            .body(new SuccessResponse(201, "successfully created image", new ImageDTO(image)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException{

        PageDTO pageDTO = new PageDTO(params);

        Page<EImage> images = sImage.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched images", images, ImageDTO.class, EImage.class));
    }

    @GetMapping(path = "/{imageId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getImage(@PathVariable Integer imageId) {

        EImage image = sImage.getById(imageId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched image", new ImageDTO(image)));
    }

    @PatchMapping(path = "/{imageId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateImage(@PathVariable Integer imageId, @RequestBody ImageDTO imageDTO) {

        EImage image = sImage.update(imageId, imageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated image", new ImageDTO(image)));
    }
}
