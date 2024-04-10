package ke.kigen.api.specifications;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SpecFactory {
    
    public SpecBuilder<?> generateSpecification(String searchQuery, SpecBuilder<?> specBuilder, List<String> allowedFields) {

        searchQuery = searchQuery != null ? searchQuery : "";
        String[] searchQueries = searchQuery.split(",");
        String patternStr = "^(?<key>\\w+(?<key1>\\.\\w+)*)(?<op>EQ|GT|LT|NIN)(?<value>(?<value1>\\w+)(?<value2>-\\w+)*)$";

        for (String searchStr : searchQueries) {
            Pattern pattern = Pattern.compile(patternStr);
            Matcher matcher = pattern.matcher(searchStr);
            while (matcher.find()) {
                String key = matcher.group("key");
                Object value = matcher.group("value");

                if (value == null || (key.split("\\.").length > 1 && !allowedFields.contains(key))) {
                    log.info("\n[LOCATION] - SpecFactory.generateSpecification()\n[MSG] - invalid filter param: {}", searchStr);
                    break;
                }
                specBuilder.with(key, matcher.group("op"), value);
            }
        }

        return specBuilder;
    }
}
