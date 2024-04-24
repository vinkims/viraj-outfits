package ke.kigen.api.services.payment.transaction_type;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionTypeDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.payment.ETransactionType;
import ke.kigen.api.repositories.payment.TransactionTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class STransactionType implements ITransactionType {
    
    private final SpecFactory specFactory;

    private final TransactionTypeDAO transactionTypeDAO;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<ETransactionType> buildFilterSpec(String searchQuery) {

        SpecBuilder<ETransactionType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ETransactionType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return transactionTypeDAO.existsByName(name);
    }

    @Override
    public ETransactionType create(TransactionTypeDTO transactionTypeDTO) {
        ETransactionType transactionType = new ETransactionType();
        transactionType.setDescription(transactionTypeDTO.getDescription());
        transactionType.setName(transactionTypeDTO.getName());

        save(transactionType);
        return transactionType;
    }

    @Override
    public Optional<ETransactionType> getById(Integer transactionTypeId) {
        return transactionTypeDAO.findById(transactionTypeId);
    }

    @Override
    public ETransactionType getById(Integer transactionTypeId, Boolean handleNotFound) {

        Optional<ETransactionType> transactionType = getById(transactionTypeId);
        if (transactionType.isPresent() && handleNotFound) {
            throw new NotFoundException("transaction type with specified id not found", "transactionTypeId");
        }
        return transactionType.get();
    }

    @Override
    public List<ETransactionType> getFilteredList(String searchQuery) {
        return transactionTypeDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ETransactionType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return transactionTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ETransactionType transactionType) {
        transactionTypeDAO.save(transactionType);
    }

    @Override
    public ETransactionType update(Integer transactiontypeId, TransactionTypeDTO transactionTypeDTO) {
        ETransactionType transactionType = getById(transactiontypeId, true);
        if (transactionTypeDTO.getDescription() != null) {
            transactionType.setDescription(transactionTypeDTO.getDescription());
        }
        if (transactionTypeDTO.getName() != null) {
            transactionType.setName(transactionTypeDTO.getName());
        }

        save(transactionType);
        return transactionType;
    }
}
