package com.ctecx.argosfims.mastertenant.repository;



import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterTenantRepository extends JpaRepository<MasterTenant, Integer> {

    MasterTenant findByTenantClientId(Integer clientId);

    // Find by domain URL
    Optional<MasterTenant> findByDomainUrl(String domainUrl);

    // Find by domain URL and status
    Optional<MasterTenant> findByDomainUrlAndStatus(String domainUrl, String status);

    // Check if domain URL exists
    boolean existsByDomainUrl(String domainUrl);
}
