import axios from 'axios';
import {
    StudentDTO,
    ParentDetails,
    ClassUpdateDTO,
    StreamUpdateDTO,
    StreamDeleteDTO,
    ClassDeleteDTO
} from "./types";

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
        token: string
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

export const updateStudent = async (student: any): Promise<any> => {
    try {
        return await axios.put(
            `${getApiBaseUrl()}/api/v1/school/students`,
            student,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

interface ParentRecord {
    parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
    parentDetails: ParentDetails
}

interface StudentParentRequest {
    studentId: number;
    parents: ParentRecord[]
}


export const saveParents = async (parentData: { parentType: string, parentDetails: ParentDetails }[], studentId: number | undefined): Promise<any> => {
    const requestBody: StudentParentRequest = {
        studentId: studentId || 0, //default student id of 0
        parents: parentData.map(parent => ({
            parentType: parent.parentType as 'MOTHER' | 'FATHER' | 'GUARDIAN',
            parentDetails: parent.parentDetails
        }))
    }
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/v1/student-parents/save`,
            requestBody,
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

// New API call to fetch student parents
export const getStudentParents = async (studentId: number): Promise<any> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/school/parents/${studentId}`, getAuthConfig());
    } catch (e) {
        console.log(e)
        return null
    }
};

export const updateClass = async (classData: ClassUpdateDTO): Promise<any> => {
    try {
        return await axios.put(
            `${getApiBaseUrl()}/api/v1/school/classes`,
            classData,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


export const updateStream = async (streamData: StreamUpdateDTO): Promise<any> => {
    try {
        return await axios.put(
            `${getApiBaseUrl()}/api/v1/school/streams`,
            streamData,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


export const deleteStream = async (streamId: number): Promise<any> => {
    const deleteDto: StreamDeleteDTO = { id: streamId };
    try {
        return await axios.delete(
            `${getApiBaseUrl()}/api/v1/school/streams`,
            {
                ...getAuthConfig(),
                data: deleteDto,
            }
        )
    } catch (error) {
        throw error
    }

}

export const deleteClass = async (classId: number): Promise<any> => {
    const deleteDto: ClassDeleteDTO = { id: classId };
    try {
        return await axios.delete(
            `${getApiBaseUrl()}/api/v1/school/classes`,
            {
                ...getAuthConfig(),
                data: deleteDto,
            }
        );
    } catch (error) {
        throw error;
    }
};