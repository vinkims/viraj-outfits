package ke.kigen.api.dtos.item;

import java.time.LocalDateTime;

import ke.kigen.api.models.item.EImage;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ImageDTO {
    
    private Integer id;

    private byte[] imageData;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    public ImageDTO(EImage image) {
        setCreatedOn(image.getCreatedOn());
        setId(image.getId());
        setImageData(image.getImageData());
        setUpdatedOn(image.getUpdatedOn());
    }
}
