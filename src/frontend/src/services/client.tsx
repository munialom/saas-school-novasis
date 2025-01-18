import axios from 'axios';

import { AxiosResponse } from 'axios';
import {AccountChart, AccountChartRequest, ReportItem} from "../lib/services";

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

interface LoginResponse {
    data: {
        token : string
    }
}
export const login = async (usernameAndPassword: any): Promise<LoginResponse> => {
    try {
        let loginPayload = usernameAndPassword;
        if (window.location.hostname === 'localhost') { // Check for local environment
            loginPayload = {
                ...usernameAndPassword,
                tenantOrClientId: 100 // Hardcode tenantOrClientId
            };
        }

        return await axios.post(
            `${getApiBaseUrl()}/api/auth/login`,
            loginPayload
        );
    } catch (e) {
        throw e;
    }
};


export const logout = async (): Promise<any> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/auto-logout/logout`, getAuthConfig())
    } catch (e) {
        throw e;
    }
};

//Account Charts
export const getChartOfAccounts = async (): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/finance/accounts`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const createAccountChart = async (request: AccountChartRequest): Promise<any> => {
    try {
        return await axios.post(`${getApiBaseUrl()}/api/v1/accounts`, request, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


export const updateAccountChart = async (request: AccountChart): Promise<any> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/v1/accounts`, request, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const deleteAccountChart = async (id: number): Promise<any> => {
    try {
        return await axios.delete(`${getApiBaseUrl()}/api/v1/accounts/${id}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


