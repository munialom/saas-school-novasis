package com.ctecx.argosfims.tenant.systemsetup;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppSetupService {

    private final AppSetupRepository appSetupRepository;

    public AppSetupService(AppSetupRepository appSetupRepository) {
        this.appSetupRepository = appSetupRepository;
    }


    public List<AppSetup> appSetupList() {
        return  (List<AppSetup>) appSetupRepository.findAll();
    }


    public List<AppSetup> mailTemplateSettings() {
        return appSetupRepository.findBySetupCategory(SetupCategory.MAIL_TEMPLATE);
    }


    public List<AppSetup> mailServerSettings() {
        return appSetupRepository.findBySetupCategory(SetupCategory.MAIL_SERVER);
    }


    public List<AppSetup> smsServerSettings() {
        return appSetupRepository.findBySetupCategory(SetupCategory.SMS);
    }

    public List<AppSetup> schoolServerSettings() {
        return appSetupRepository.findBySetupCategory(SetupCategory.SCHOOL);
    }
    public List<AppSetup> nssfMappings() {
        return appSetupRepository.findBySetupCategory(SetupCategory.GENERAL);
    }
    public List<AppSetup> levies() {
        return appSetupRepository.findBySetupCategory(SetupCategory.GENERAL);
    }

    public List<AppSetup> posHardware() {
        return appSetupRepository.findBySetupCategory(SetupCategory.GENERAL);
    }


    public void saveAll(List<AppSetup> settingsList) {
        appSetupRepository.saveAll(settingsList);
    }

    public Map<String,String> getSettingMapByCategory(SetupCategory category) {
        List<AppSetup> settings = appSetupRepository.findBySetupCategory(category);
        return settings.stream().collect(Collectors.toMap(AppSetup::getKey, AppSetup::getValue));
    }
    public void updateSetting(AppSetup setting) {
        appSetupRepository.save(setting);
    }

    public AppSetup getSetting(String key) {
        return appSetupRepository.findById(key).orElse(null);
    }
}