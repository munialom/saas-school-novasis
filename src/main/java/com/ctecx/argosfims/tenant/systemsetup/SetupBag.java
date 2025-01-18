package com.ctecx.argosfims.tenant.systemsetup;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class SetupBag {

    private List<AppSetup> appSetupList;

    public AppSetup get(String key) {
        int index = appSetupList.indexOf(new AppSetup(key));

        if (index >= 0) {
            return appSetupList.get(index);
        }
        return null;
    }


    public String getValue(String key) {

        AppSetup appSetup = get(key);

        if (appSetup != null) {

            return appSetup.getValue();

        }


        return null;
    }

    public void update(String key, String value) {
        AppSetup setting = get(key);
        if (setting != null && value != null) {
            setting.setValue(value);
        }
    }



    public List<AppSetup> list() {
        return appSetupList;
    }
}
