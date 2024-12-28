import axios from 'axios';
import { StudentDTO } from "./types";

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
        return await axios.post(
            `${getApiBaseUrl()}/api/auth/login`,
            usernameAndPassword
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


export const getStudents = async (): Promise<any> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/school/students`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const saveStudent = async (student: StudentDTO): Promise<any> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/students`,
            student,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getClasses = async (): Promise<any> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/school/classes`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const createClass = async (studentClass: any): Promise<any> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/classes`,
            studentClass,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getStreams = async (): Promise<any> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/school/streams`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


export const createStream = async (stream: any): Promise<any> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/streams`,
            stream,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};