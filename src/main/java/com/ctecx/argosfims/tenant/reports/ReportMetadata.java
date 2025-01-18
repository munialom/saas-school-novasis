package com.ctecx.argosfims.tenant.reports;



import java.util.HashMap;
import java.util.Map;

public record ReportMetadata(
        String title,
        String companyName,
        String companyAddress,
        String telephone,
        Map<String, String> additionalInfo
) {
    public static class Builder {
        private String title;
        private String companyName;
        private String companyAddress;
        private String telephone;
        private Map<String, String> additionalInfo = new HashMap<>();

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder companyAddress(String companyAddress) {
            this.companyAddress = companyAddress;
            return this;
        }

        public Builder telephone(String telephone) {
            this.telephone = telephone;
            return this;
        }

        public Builder additionalInfo(Map<String, String> additionalInfo) {
            this.additionalInfo = additionalInfo;
            return this;
        }

        public ReportMetadata build() {
            return new ReportMetadata(title, companyName, companyAddress, telephone, additionalInfo);
        }
    }
}
