package com.ctecx.argosfims.mastertenant.service;


import com.ctecx.argosfims.mastertenant.entity.MasterTenant;

import java.util.Optional;

/**
 * @author Md. Amran Hossain
 */
public interface MasterTenantService {

    MasterTenant findByClientId(Integer clientId);
    Optional<MasterTenant> findByDomainUrl(String domainUrl);
}
