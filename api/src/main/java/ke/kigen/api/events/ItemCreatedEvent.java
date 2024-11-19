package ke.kigen.api.events;

import ke.kigen.api.models.item.EItem;
import org.springframework.context.ApplicationEvent;

public class ItemCreatedEvent extends ApplicationEvent {
    
    private final EItem item;

    public ItemCreatedEvent(Object source, EItem item) {
        super(source);
        this.item = item;
    }

    public EItem getItem() {
        return item;
    }
}
