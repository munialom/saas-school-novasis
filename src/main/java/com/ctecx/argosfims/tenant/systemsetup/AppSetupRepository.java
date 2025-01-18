package com.ctecx.argosfims.tenant.systemsetup;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AppSetupRepository extends CrudRepository<AppSetup, String> {
    List<AppSetup> findBySetupCategory(SetupCategory category);
}
