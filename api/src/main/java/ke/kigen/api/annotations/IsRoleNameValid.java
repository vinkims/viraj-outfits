package ke.kigen.api.annotations;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ke.kigen.api.validators.VRoleNameValid;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({FIELD, ANNOTATION_TYPE, PARAMETER, TYPE})
@Constraint(validatedBy = VRoleNameValid.class)
public @interface IsRoleNameValid {
    
    String message() default "Invalid role name; provided value already in use";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
