package com.ctecx.argosfims.tenant.suppliers;

import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupplierService {

    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;
    private final SupplierRepository supplierRepository;

    @Autowired
    public SupplierService(TenantJdbcTemplateConfig tenantJdbcTemplateConfig, SupplierRepository supplierRepository) {
        this.tenantJdbcTemplateConfig = tenantJdbcTemplateConfig;
        this.supplierRepository = supplierRepository;
    }

    private JdbcTemplate getJdbcTemplate() {
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        String sql = "UPDATE suppliers SET supplierName = ?, location = ?, phone = ?, taxPin = ?, type = ? WHERE id = ?";
        int update = getJdbcTemplate().update(sql, updatedSupplier.getSupplierName(), updatedSupplier.getLocation(), updatedSupplier.getPhone(), updatedSupplier.getTaxPin(), updatedSupplier.getType(), id);
        if (update > 0){
            return supplierRepository.findById(id).orElse(null);
        }
        return null;
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}