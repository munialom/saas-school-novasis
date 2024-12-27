package com.ctecx.argosfims.mastertenant.service;



import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.repository.MasterTenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Optional;

@Service
public class MasterTenantServiceImpl implements MasterTenantService {

    private static final Logger LOG = LoggerFactory.getLogger(MasterTenantServiceImpl.class);
    private static final String ACTIVE_STATUS = "ACTIVE";
    private static final String BASE_DOMAIN = "ctecx.com";

    @Autowired
    private MasterTenantRepository masterTenantRepository;

    @Override
    public MasterTenant findByClientId(Integer clientId) {
        LOG.info("findByClientId() method call...");
        return masterTenantRepository.findByTenantClientId(clientId);
    }

    @Override
    public Optional<MasterTenant> findByDomainUrl(String domainUrl) {
        LOG.info("findByDomainUrl() method call for domain: {}", domainUrl);

        if (domainUrl == null || domainUrl.trim().isEmpty()) {
            LOG.warn("Domain URL is null or empty");
            return Optional.empty();
        }

        try {
            // Extract subdomain from full URL
            String subdomain = extractSubdomain(domainUrl);
            if (subdomain == null) {
                LOG.warn("Could not extract valid subdomain from URL: {}", domainUrl);
                return Optional.empty();
            }

            LOG.info("Extracted subdomain: {}", subdomain);

            // Construct the standard domain format
            String standardDomainFormat = String.format("https://%s.%s/", subdomain, BASE_DOMAIN);

            // Find tenant by domain URL where status is ACTIVE
            return masterTenantRepository.findByDomainUrlAndStatus(standardDomainFormat, ACTIVE_STATUS);

        } catch (Exception e) {
            LOG.error("Error finding tenant by domain URL: {}", domainUrl, e);
            return Optional.empty();
        }
    }

    private String extractSubdomain(String urlString) {
        try {
            // Handle cases where protocol is missing
            if (!urlString.startsWith("http")) {
                urlString = "https://" + urlString;
            }

            URL url = new URL(urlString);
            String host = url.getHost();

            // Verify it's a ctecx.com domain
            if (!host.endsWith(BASE_DOMAIN)) {
                LOG.warn("URL is not a {} domain: {}", BASE_DOMAIN, host);
                return null;
            }

            // Extract subdomain
            String subdomain = host.replace("." + BASE_DOMAIN, "");

            // Validate subdomain format
            if (subdomain.isEmpty() || subdomain.contains(".")) {
                LOG.warn("Invalid subdomain format: {}", subdomain);
                return null;
            }

            return subdomain.toLowerCase();

        } catch (Exception e) {
            LOG.error("Error parsing URL: {}", urlString, e);
            return null;
        }
    }
}
