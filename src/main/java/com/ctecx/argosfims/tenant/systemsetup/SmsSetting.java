package com.ctecx.argosfims.tenant.systemsetup;

import java.util.List;

public class SmsSetting extends SetupBag {

    public SmsSetting(List<AppSetup> appSetupList) {
        super(appSetupList);
    }

    public String getSenderID() {

        return super.getValue("SENDER_ID");
    }

    public String getSmsKey() {

        return super.getValue("SMS_KEY");
    }


    public String getSmsUrl() {

        return super.getValue("SMS_URL");
    }


    public int getPortNumber() {

        return Integer.parseInt(super.getValue("MAIL_PORT"));
    }


    public String getPassword() {

        return super.getValue("MAIL_PASSWORD");
    }

    public String getSenderEmail() {

        return super.getValue("MAIL_FROM");
    }

    public String getSmtpAuth() {

        return super.getValue("SMTP_AUTH");
    }

    public String getSmtpSecure() {

        return super.getValue("SMTP_SECURED");
    }

    public String getSubject() {

        return super.getValue("VERIFY_SUBJECT");
    }

    public String getContent() {

        return super.getValue("VERIFY_CONTENT");
    }

    public void updateSiteLogo(String value){
        super.update("SCHOOL_LOGO",value);
    }


}
