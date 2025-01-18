package com.ctecx.argosfims.tenant.systemsetup;

import java.util.List;

public class EmailSetting extends SetupBag {

    public EmailSetting(List<AppSetup> appSetupList) {
        super(appSetupList);
    }

    public String getHost() {

        return super.getValue("MAIL_HOST");
    }

    public String getUserName() {

        return super.getValue("MAIL_USERNAME");
    }


    public String getSenderName() {

        return super.getValue("MAIL_SENDER_NAME");
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


}
