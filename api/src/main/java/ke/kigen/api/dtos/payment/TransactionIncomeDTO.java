package ke.kigen.api.dtos.payment;

import ke.kigen.api.dtos.income.IncomeDTO;
import ke.kigen.api.models.payment.ETransactionIncome;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionIncomeDTO {
    
    private IncomeDTO income;

    private Integer incomeId;

    public TransactionIncomeDTO(ETransactionIncome transactionIncome) {
        setIncome(new IncomeDTO(transactionIncome.getIncome()));
    }
}
