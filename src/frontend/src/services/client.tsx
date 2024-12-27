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


interface Student {
    // Define student properties based on your API
    id?: number;
    name: string;
    // Add other properties as needed
}

export const getStudents = async (): Promise<any> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/students`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const saveStudent = async (student: Student): Promise<any> => {
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