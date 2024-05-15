package ke.kigen.api.services.income;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.income.IncomeDTO;
import ke.kigen.api.events.IncomeCreatedEvent;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.models.income.EIncomeType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.income.IncomeDAO;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.services.user.IUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SIncome implements IIncome {
    
    private final ApplicationEventPublisher eventPublisher;

    private final IIncomeType sIncomeType;

    private final IncomeDAO incomeDAO;

    private final IStatus sStatus;

    private final IUser sUser;

    private final IUserDetails sUserDetails;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EIncome> buildFilterSpec(String searchQuery) {

        SpecBuilder<EIncome> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EIncome>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EIncome create(IncomeDTO incomeDTO) {
        EIncome income = new EIncome();
        income.setAmount(incomeDTO.getAmount());
        income.setCreatedOn(LocalDateTime.now());
        income.setDescription(incomeDTO.getDescription());
        setIncomeType(income, incomeDTO.getIncomeTypeId());
        Integer statusId = incomeDTO.getStatusId() == null 
            ? mainConfig.getStatus().getCompleteId() 
            : incomeDTO.getStatusId();
        setStatus(income, statusId);
        EUser user = sUserDetails.getActiveUserByContact();
        Integer userId = incomeDTO.getUserId() == null 
            ? user.getId() : incomeDTO.getUserId();
        setUser(income, userId);

        save(income);
        eventPublisher.publishEvent(new IncomeCreatedEvent(this, income));
        return income;
    }

    @Override
    public Optional<EIncome> getById(Integer incomeId) {
        return incomeDAO.findById(incomeId);
    }

    @Override
    public EIncome getById(Integer incomeId, Boolean handleNotFound) {

        Optional<EIncome> income = getById(incomeId);
        if (!income.isPresent() && handleNotFound) {
            throw new NotFoundException("income with specified id not found", "incomeId");
        }
        return income.get();
    }

    @Override
    public List<EIncome> getFilteredList(String searchQuery) {
        return incomeDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EIncome> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return incomeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EIncome income) {
        incomeDAO.save(income);
    }

    private void setIncomeType(EIncome income, Integer incomeTypeId) {
        if (incomeTypeId == null) { return; }

        EIncomeType incomeType = sIncomeType.getById(incomeTypeId, true);
        income.setIncomeType(incomeType);
    }

    private void setStatus(EIncome income, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        income.setStatus(status);
    }

    private void setUser(EIncome income, Integer userId) {
        if (userId == null) { return; }

        EUser user = sUser.getById(userId, true);
        income.setUser(user);
    }

    @Override
    public EIncome update(Integer incomeId, IncomeDTO incomeDTO) {
        EIncome income = getById(incomeId, true);
        if (incomeDTO.getAmount() != null) {
            income.setAmount(incomeDTO.getAmount());
        }
        if (incomeDTO.getDescription() != null) {
            income.setDescription(incomeDTO.getDescription());
        }
        setIncomeType(income, incomeDTO.getIncomeTypeId());
        setStatus(income, incomeDTO.getStatusId());
        income.setUpdatedOn(LocalDateTime.now());
        setUser(income, incomeDTO.getUserId());

        save(income);
        return income;
    }
}
