package ke.kigen.api.services.sales;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.sales.SaleTypeDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.sales.ESaleType;
import ke.kigen.api.repositories.sales.SaleTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SSaleType implements ISaleType {

    private final SaleTypeDAO saleTypeDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<ESaleType> buildFilterSpec(String searchQuery) {

        SpecBuilder<ESaleType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ESaleType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return saleTypeDAO.existsByName(name);
    }

    @Override
    public ESaleType create(SaleTypeDTO saleTypeDTO) {
        ESaleType saleType = new ESaleType();
        saleType.setDescrition(saleTypeDTO.getDescription());
        saleType.setName(saleTypeDTO.getName());

        save(saleType);
        return saleType;
    }

    @Override
    public Optional<ESaleType> getById(Integer saleTypeId) {
        return saleTypeDAO.findById(saleTypeId);
    }

    @Override
    public ESaleType getById(Integer saleTypeId, Boolean handleNotFound) {

        Optional<ESaleType> saleType = getById(saleTypeId);
        if (saleType.isPresent()) {
            return saleType.get();
        } else if (Boolean.TRUE.equals(handleNotFound)) {
            throw new NotFoundException("sale type with specified id not found", "saleTypeId");
        }
        return null;
    }

    @Override
    public List<ESaleType> getFilteredList(String searchQuery) {
        return saleTypeDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ESaleType> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return saleTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ESaleType saleType) {
        saleTypeDAO.save(saleType);
    }

    @Override
    public ESaleType update(Integer saleTypeId, SaleTypeDTO saleTypeDTO) {
        ESaleType saleType = getById(saleTypeId, true);
        if (saleTypeDTO.getDescription() != null) {
            saleType.setDescrition(saleTypeDTO.getDescription());
        }
        if (saleTypeDTO.getName() != null) {
            saleType.setName(saleTypeDTO.getName());
        }

        save(saleType);
        return saleType;
    }
    
}
