export interface Class {
    id: number;
    className: string;
    status: boolean;
}
export interface Stream {
    id: number;
    streamName: string;
    status: boolean;
}

export interface Student {
    id: number;
    admissionNumber: string;
    fullName: string;
    gender: 'MALE' | 'FEMALE';
    mode: 'BOARDING' | 'DAY';
    studentClass: Class;
    studentStream: Stream;
    status: boolean;
    location: string;
    yearOf: string;
    admission : string;
}

export const dummyClasses: Class[] = [
    { id: 1, className: 'Form One', status: true },
    { id: 2, className: 'Form Two', status: true },
    { id: 3, className: 'Form Three', status: false },
    { id: 4, className: 'Form Four', status: true },
];


export const dummyStreams: Stream[] = [
    { id: 1, streamName: 'East', status: true },
    { id: 2, streamName: 'West', status: true },
    { id: 3, streamName: 'North', status: false },
    { id: 4, streamName: 'South', status: true },
];


export const dummyStudents: Student[] = [
    {
        id: 1,
        admissionNumber: '2024/001',
        fullName: 'John Doe',
        gender: 'MALE',
        mode: 'BOARDING',
        studentClass: dummyClasses[0],
        studentStream: dummyStreams[0],
        status: true,
        location: 'Nairobi',
        yearOf: '2024',
        admission: 'Regular'
    },
    {
        id: 2,
        admissionNumber: '2024/002',
        fullName: 'Jane Doe',
        gender: 'FEMALE',
        mode: 'DAY',
        studentClass: dummyClasses[1],
        studentStream: dummyStreams[1],
        status: true,
        location: 'Kisumu',
        yearOf: '2023',
        admission: 'Transfer'
    },
    {
        id: 3,
        admissionNumber: '2024/003',
        fullName: 'Peter Pan',
        gender: 'MALE',
        mode: 'BOARDING',
        studentClass: dummyClasses[2],
        studentStream: dummyStreams[2],
        status: false,
        location: 'Mombasa',
        yearOf: '2022',
        admission: 'Regular'
    },
    {
        id: 4,
        admissionNumber: '2024/004',
        fullName: 'Alice Wonderland',
        gender: 'FEMALE',
        mode: 'DAY',
        studentClass: dummyClasses[3],
        studentStream: dummyStreams[3],
        status: true,
        location: 'Eldoret',
        yearOf: '2021',
        admission: 'Transfer'
    },
    {
        id: 5,
        admissionNumber: '2024/005',
        fullName: 'Bob the Builder',
        gender: 'MALE',
        mode: 'BOARDING',
        studentClass: dummyClasses[0],
        studentStream: dummyStreams[1],
        status: true,
        location: 'Nyeri',
        yearOf: '2020',
        admission: 'Regular'
    },
    {
        id: 6,
        admissionNumber: '2024/006',
        fullName: 'Dora the Explorer',
        gender: 'FEMALE',
        mode: 'DAY',
        studentClass: dummyClasses[1],
        studentStream: dummyStreams[2],
        status: false,
        location: 'Thika',
        yearOf: '2019',
        admission: 'Transfer'
    },
    {
        id: 7,
        admissionNumber: '2024/007',
        fullName: 'Thomas the Train',
        gender: 'MALE',
        mode: 'BOARDING',
        studentClass: dummyClasses[2],
        studentStream: dummyStreams[3],
        status: true,
        location: 'Nakuru',
        yearOf: '2018',
        admission: 'Regular'
    },
    {
        id: 8,
        admissionNumber: '2024/008',
        fullName: 'Mickey Mouse',
        gender: 'MALE',
        mode: 'DAY',
        studentClass: dummyClasses[3],
        studentStream: dummyStreams[0],
        status: true,
        location: 'Kitale',
        yearOf: '2017',
        admission: 'Transfer'
    },
];