package ke.kigen.api.publishers;

import ke.kigen.api.events.ItemCreatedEvent;
import ke.kigen.api.models.item.EItem;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemsEventPublisher {
    
    private final ApplicationEventPublisher publisher;

    public void publishItemEvent(final EItem item) {
        ItemCreatedEvent createdEvent = new ItemCreatedEvent(this, item);
        publisher.publishEvent(createdEvent);
    }
}
