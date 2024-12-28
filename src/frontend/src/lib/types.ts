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

export interface Class {
    id: number;
    className: string;
    status: boolean
}
export interface Stream {
    id: number;
    streamName: string;
    status: boolean;
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