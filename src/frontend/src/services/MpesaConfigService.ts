import axios from 'axios';

const getApiBaseUrl = (): string => {
    try {
        const hostname = window.location.hostname;
        if (!hostname) return 'http://localhost:8080';
        if (!hostname.endsWith("ctecx.com")) return 'http://localhost:8080';

        const subdomain = hostname.replace(".ctecx.com", "");
        if (!subdomain || subdomain.includes(".")) return 'http://localhost:8080';

        return `https://${subdomain}.ctecx.com`;
    } catch (e) {
        console.error("Base URL error:", e);
        return 'http://localhost:8080';
    }
};
const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
});

export const MpesaConfigService = {
    getMpesaConfigurations: async (): Promise<any> => {
        try {
            const response=  await axios.get(`${getApiBaseUrl()}/api/mpesa/config`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMpesaConfigurations: async (config: any): Promise<any> => {
        try {
            return await axios.post(`${getApiBaseUrl()}/api/mpesa/config`, config, getAuthConfig());
        } catch (error) {
            throw error;
        }
    },

    updateMpesaConfigurations: async (id: number, config: any): Promise<any> => {
        try {
            return await axios.put(`${getApiBaseUrl()}/api/mpesa/config/${id}`, config, getAuthConfig());
        } catch (error) {
            throw error;
        }
    },

};