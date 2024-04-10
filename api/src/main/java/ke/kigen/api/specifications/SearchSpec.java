package ke.kigen.api.specifications;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import ke.kigen.api.dtos.general.SearchCriteriaDTO;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class SearchSpec<T> implements Specification<T> {
    
    private static final long serialVersionUID = 1L;

    private SearchCriteriaDTO searchCriteria;

    public SearchSpec(SearchCriteriaDTO searchCriteriaDTO) {
        setSearchCriteria(searchCriteriaDTO);
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        Predicate predicate = null;
        String operation = searchCriteria.getOperation();
        Object value = searchCriteria.getValue();
        Join<?, ?> fieldJoin = null;

        String[] keys = searchCriteria.getKey().split("\\.");
        String key = keys[0];
        Class<? extends Object> keyType = root.get(key).getJavaType();
        if (keys.length > 1) {
            Path<Object> keyVal;
            fieldJoin = root.join(keys[0], JoinType.LEFT);
            for (int i = 1; i < keys.length - 1;i++) {
                if (i > 0) {
                    fieldJoin = fieldJoin.join(keys[i], JoinType.LEFT);
                }
                keyVal = root.get(keys[i - 1]);
                keyType = keyVal.getJavaType();
            }
        }

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            value = keyType == LocalDateTime.class ? LocalDate.parse((String) value, dateTimeFormatter).atStartOfDay() : value;
        } catch (Exception e) {
            log.error("\n[LOCATION] - specifications.SearchSpec.toPredicate()\n[MSG] - {}", e.getLocalizedMessage());
            return null;
        }

        if (operation.equalsIgnoreCase("GT")) {
            predicate = keyType == LocalDateTime.class 
                ? criteriaBuilder.greaterThanOrEqualTo(root.<LocalDateTime>get(key), (LocalDateTime) value) 
                : criteriaBuilder.greaterThanOrEqualTo(root.<String>get(key), value.toString());
        } else if (operation.equalsIgnoreCase("LT")) {
            predicate = keyType == LocalDateTime.class 
                ? criteriaBuilder.lessThanOrEqualTo(root.<LocalDateTime>get(key), (LocalDateTime) value) 
                : criteriaBuilder.lessThanOrEqualTo(root.<String>get(key), value.toString());
        } else if (fieldJoin != null && operation.equalsIgnoreCase("EQ")) {
            query.distinct(true);
            String maxKeysValue = keys[keys.length - 1];
            predicate = keyType == String.class 
                ? criteriaBuilder.like(criteriaBuilder.lower(fieldJoin.<String>get(maxKeysValue)), "%" + ((String) value).toLowerCase() + "%") 
                : criteriaBuilder.equal(fieldJoin.<String>get(maxKeysValue), value);
        } else if (operation.equalsIgnoreCase("EQ")) {
            query.distinct(true);
            predicate = keyType == String.class 
                ? criteriaBuilder.like(criteriaBuilder.lower(root.<String>get(key)), "%" + ((String) value).toLowerCase() + "%") 
                : criteriaBuilder.equal(root.get(key), value);
        } else if (fieldJoin != null && operation.equalsIgnoreCase("NEQ")) {
            String maxKeysValue = keys[keys.length - 1];
            predicate = keyType == String.class 
                ? criteriaBuilder.notEqual(fieldJoin.<String>get(maxKeysValue), "%" + ((String) value).toLowerCase() + "%") 
                : criteriaBuilder.notEqual(fieldJoin.<String>get(maxKeysValue), value);
        } else if (operation.equalsIgnoreCase("NEQ")) {
            predicate = keyType == String.class 
                ? criteriaBuilder.notEqual(root.<String>get(key), "%" + ((String) value).toLowerCase() + "%") 
                : criteriaBuilder.notEqual(root.get(key), value);
        }

        return predicate;
    }
}
