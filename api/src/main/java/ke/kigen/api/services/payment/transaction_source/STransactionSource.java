package ke.kigen.api.services.payment.transaction_source;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionSourceDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.payment.ETransactionSource;
import ke.kigen.api.repositories.payment.TransactionSourceDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class STransactionSource implements ITransactionSource {

    private final SpecFactory specFactory;

    private final TransactionSourceDAO transactionSourceDAO;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<ETransactionSource> buildFilterSpec(String searchQuery) {

        SpecBuilder<ETransactionSource> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ETransactionSource>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return transactionSourceDAO.existsByName(name);
    }

    @Override
    public ETransactionSource create(TransactionSourceDTO transactionSourceDTO) {
        ETransactionSource transactionSource = new ETransactionSource();
        transactionSource.setDescription(transactionSourceDTO.getDescription());
        transactionSource.setName(transactionSourceDTO.getName());

        save(transactionSource);
        return transactionSource;
    }

    @Override
    public Optional<ETransactionSource> getById(Integer transactionSourceId) {
        return transactionSourceDAO.findById(transactionSourceId);
    }

    @Override
    public ETransactionSource getById(Integer transactionSourceId, Boolean handleNotFound) {
        
        Optional<ETransactionSource> transactionSource = getById(transactionSourceId);
        if (transactionSource.isPresent()) {
            return transactionSource.get();
        } else if (Boolean.TRUE.equals(handleNotFound)) {
            throw new NotFoundException("transaction source with specified id not found", "transactionSourceId");
        }
        return null;
    }

    @Override
    public List<ETransactionSource> getFilteredList(String searchQuery) {
        return transactionSourceDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ETransactionSource> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return transactionSourceDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ETransactionSource transactionSource) {
        transactionSourceDAO.save(transactionSource);
    }

    @Override
    public ETransactionSource update(Integer transactionSourceId, TransactionSourceDTO transactionSourceDTO) {
        ETransactionSource transactionSource = getById(transactionSourceId, true);
        if (transactionSourceDTO.getDescription() != null) {
            transactionSource.setDescription(transactionSourceDTO.getDescription());
        }
        if (transactionSourceDTO.getName() != null) {
            transactionSource.setName(transactionSourceDTO.getName());
        }

        save(transactionSource);
        return transactionSource;
    }
    
}
