package ke.kigen.api.dtos.contacts;

import ke.kigen.api.annotations.IsContactTypeNameValid;
import ke.kigen.api.models.contacts.EContactType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ContactTypeDTO {
    
    private Integer id;

    @IsContactTypeNameValid
    private String name;

    private String description;

    private String regexValue;

    public ContactTypeDTO(EContactType contactType) {
        setDescription(contactType.getDescription());
        setId(contactType.getId());
        setName(contactType.getName());
        setRegexValue(contactType.getRegexValue());
    }
}
