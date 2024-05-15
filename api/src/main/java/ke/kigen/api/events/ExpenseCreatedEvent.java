package ke.kigen.api.events;

import org.springframework.context.ApplicationEvent;

import ke.kigen.api.models.expense.EExpense;

public class ExpenseCreatedEvent extends ApplicationEvent {
    
    private final EExpense expense;

    public ExpenseCreatedEvent(Object source, EExpense expense) {
        super(source);
        this.expense = expense;
    }

    public EExpense getExpense() {
        return expense;
    }
}
