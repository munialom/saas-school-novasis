// types.ts
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
    TotalRecords?: number;
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
export interface StudentSearchResponse {
    records: Student[],
    totalRecords: number
}


export interface ParentDetails {
    fullName: string;
    phoneNumbers: string[];
    emailAddress: string;
}

export interface ParentResponse {
    Id: number;
    CreatedDate: string;
    CreatedBy: string;
    LastModifiedDate: string;
    ModifiedBy: string;
    ParentDetails: ParentDetails | null;
    ParentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
    StudentId: number
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


export interface ClassUpdateDTO {
    id: number;
    className: string;
    status: boolean;
}

export interface StreamUpdateDTO {
    id: number;
    streamName: string;
    status: boolean;
}


export interface StreamDeleteDTO {
    id: number;
}

export interface ClassDeleteDTO {
    id: number;
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