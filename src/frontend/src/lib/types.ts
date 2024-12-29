export interface Student {
    id?: number;
    admissionNumber: string;
    fullName: string;
    gender: string;
    location: string;
    admission: Admission;
    mode: Mode;
    status: boolean;
    yearOf: number;
    studentClass: {
        className: string;
    };
    studentStream: {
        streamName: string
    };
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface StudentDTO {
    fullName: string;
    admissionNumber: string;
    gender: string | null;
    location: string;
    classId: number | null;
    streamId: number | null;
    status: boolean;
    admission: string | null;
    mode: string | null;
    yearOf: number | null;
}

export interface ParentDetails {
    fullName: string;
    phoneNumbers: string[];
    emailAddress: string;
}

export interface ParentResponse {
    id: number;
    created_date: string;
    created_by: string;
    last_modified_date: string;
    modified_by: string;
    parentDetails: ParentDetails | string;
    parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
    student_id: number
}

export interface Class {
    id: number;
    className: string;
    status: boolean,
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}
export interface Stream {
    id: number;
    streamName: string;
    status: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export enum Admission {
    SESSION = "SESSION",
    TRANSFER = "TRANSFER",
    ALUMNI = "ALUMNI"
}

export enum Mode {
    BOARDING = "BOARDING",
    DAY = "DAY"
}