package ke.kigen.api.events;

import org.springframework.context.ApplicationEvent;

import ke.kigen.api.models.income.EIncome;

public class IncomeCreatedEvent extends ApplicationEvent {
    
    private final EIncome income;

    public IncomeCreatedEvent(Object source, EIncome income) {
        super(source);
        this.income = income;
    }

    public EIncome getIncome() {
        return income;
    }
}
