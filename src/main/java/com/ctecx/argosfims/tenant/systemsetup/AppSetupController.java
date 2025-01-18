package com.ctecx.argosfims.tenant.systemsetup;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class AppSetupController {

    private final AppSetupService appSetupService;

    public AppSetupController(AppSetupService appSetupService) {
        this.appSetupService = appSetupService;
    }



    @GetMapping("/map/{category}")
    public ResponseEntity<Map<String, String>> getSettingsByCategory(@PathVariable("category") SetupCategory category) {
        Map<String,String> settings = appSetupService.getSettingMapByCategory(category);
        return new ResponseEntity<>(settings, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateSetting(@RequestBody AppSetup updatedSetting) {
        AppSetup setting = appSetupService.getSetting(updatedSetting.getKey());

        if (setting != null) {
            setting.setValue(updatedSetting.getValue());
            appSetupService.updateSetting(setting);

            return new ResponseEntity<>("Setting Updated Successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Setting Not Found",HttpStatus.NOT_FOUND);
        }

    }


    @GetMapping("/list")
    public ResponseEntity<List<AppSetup>> getAllSettings() {
        List<AppSetup> settings = appSetupService.appSetupList();
        return new ResponseEntity<>(settings, HttpStatus.OK);
    }



}