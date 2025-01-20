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


export interface StudentUpdateDTO {
    id: number;
    admissionNumber?: string;
    fullName?: string;
    gender?: string;
    location?: string;
    admission?: string;
    mode?: string;
    status?: boolean;
    yearOf?: number | null;
    classId?: number | null;
    streamId?: number | null;
}

export interface CascaderOption {
    value: number;
    label: string;
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

export interface AccountGroup  {
    displayText: string;
    parentGroup: string;
}

export enum AccountGroupEnum {
    CURRENT_ASSETS = "CURRENT_ASSETS",
    FIXED_ASSETS = "FIXED_ASSETS",
    LONG_TERM_INVESTMENTS = "LONG_TERM_INVESTMENTS",
    OTHER_ASSETS = "OTHER_ASSETS",
    CURRENT_LIABILITIES = "CURRENT_LIABILITIES",
    LONG_TERM_LIABILITIES = "LONG_TERM_LIABILITIES",
    SHARE_CAPITAL = "SHARE_CAPITAL",
    RETAINED_EARNINGS = "RETAINED_EARNINGS",
    OPERATING_REVENUE = "OPERATING_REVENUE",
    NON_OPERATING_REVENUE = "NON_OPERATING_REVENUE",
    OPERATING_EXPENSES = "OPERATING_EXPENSES",
    NON_OPERATING_EXPENSES = "NON_OPERATING_EXPENSES",
    COST_OF_GOODS_SOLD = "COST_OF_GOODS_SOLD",
}


export interface AccountChart {
    id: number;
    accountCode: number;
    name: string;
    alias: string;
    parent: AccountChart | null;
    accountGroupEnum: AccountGroupEnum;
    accountGroup: string;
    parentGroup: string;
    bankAccount: boolean;
    linkedBankAccount: AccountChart | null;
    currencyCode: string;
    status: boolean;
    createdBy:string;
    createdAt: string;
}

export interface AccountChartRequest {
    name: string;
    alias: string;
    parentId?: number | null;
    accountGroup: AccountGroupUpdate;
    parentGroup?: string;
    bankAccount: boolean;
    linkedBankAccountId?: number | null;
    receivableAccountId?: number | null;
    receivable?:boolean;
    payable?:boolean;
}


type AccountGroupUpdate = keyof typeof AccountGroupData;

export interface AccountChartResponse {
    AccountCode: number;
    AccountGroup: string;
    AccountName: string;
    AccountStatus: string;
    CreatedBy: string;
    CreatedDate: string;
    Description: string;
    IsBankAccount: boolean; // Keeping boolean type
    ParentGroup: string;
    id: number;
}

export interface ChartOfAccountUpdateDTO {
    id: number;
    accountName: string;
    isBankAccount: boolean;
    accountStatus: boolean;
}


export const AccountGroupData = {
    CURRENT_ASSETS: { displayText: "Current Assets", parentGroup: "ASSETS" },
    FIXED_ASSETS: { displayText: "Fixed Assets", parentGroup: "ASSETS" },
    LONG_TERM_INVESTMENTS: { displayText: "Long-term Investments", parentGroup: "ASSETS" },
    OTHER_ASSETS: { displayText: "Other Assets", parentGroup: "ASSETS" },
    CURRENT_LIABILITIES: { displayText: "Current Liabilities", parentGroup: "LIABILITIES" },
    LONG_TERM_LIABILITIES: { displayText: "Long-term Liabilities", parentGroup: "LIABILITIES" },
    SHARE_CAPITAL: { displayText: "Share Capital", parentGroup: "EQUITY" },
    RETAINED_EARNINGS: { displayText: "Retained Earnings", parentGroup: "EQUITY" },
    OPERATING_REVENUE: { displayText: "Operating Revenue", parentGroup: "REVENUE" },
    NON_OPERATING_REVENUE: { displayText: "Non-operating Revenue", parentGroup: "REVENUE" },
    OPERATING_EXPENSES: { displayText: "Operating Expenses", parentGroup: "EXPENSES" },
    NON_OPERATING_EXPENSES: { displayText: "Non-operating Expenses", parentGroup: "EXPENSES" },
    COST_OF_GOODS_SOLD: { displayText: "Cost of Goods Sold", parentGroup: "EXPENSES" },
};

export interface RevenueAccount {
    id:number;
    accountCode:number;
    accountName:string
}

// In types.ts
export interface InvoiceVoteHeadItem {
    id: number;
    accountCode: number;
    accountName: string;
    amount: number;
}


export interface BulkInvoiceRequest {
    classId: number;
    transactionDate: string;
    term: string;
    studentIds: number[];
    accounts: {id:number,amount:number}[];
    individualStudentIds:boolean
}

// New Interfaces for Payment Reports
export interface StudentTransactionSummary {
    totalBalance: string;
    totalPayments: string;
    totalInvoiced: string;
}


export interface AccountBalance {
    id:number;
    account_name:string;
    balance:number
}
export interface StudentFeePaymentRequest {
    accountId: number;
    accountName: string;
    balance: number;
    amount:number
}
/*export interface PaymentRequest {
    studentId: number;
    bankingDate: string;
    paymentDate: string;
    payMode: string;
    term: string;
    ref: string;
    bankId: number;
    studentFeePaymentRequests: StudentFeePaymentRequest[];
}*/

export interface PaymentRequest {
    studentId: number;
    bankingDate: string;
    paymentDate: string;
    payMode: string;
    term: string;
    ref: string;
    bankId: number;
    studentFeePaymentRequests: StudentFeePaymentRequest[];
    manualAllocation:boolean
    amountPaid?:number
}

export type ReportItem = { [key: string]: any };

export interface ProjectDTO {
    projectName: string;
    projectType: string;
    projectBudget: number;
}

export interface Project extends ProjectDTO {
    id: number
}
export type PaymentSummaryResponse = ReportItem[];
export type ClassSummaryResponse = ReportItem[];
export type DateSummaryResponse = ReportItem[];
export type BankSummaryResponse = ReportItem[];
export type PaymentVoucherResponse = ReportItem[];
export type SupplierInvoiceResponse= ReportItem[];
// New report types for dynamic data
export type TransactionReportItem = { [key: string]: any };
export type InvoicedReportItem = { [key: string]: any };
export type PaymentReportItem = { [key: string]: any };


// src/lib/types.ts
export enum SetupCategory {
    GENERAL = 'GENERAL',
    MAIL_SERVER = 'MAIL_SERVER',
    MAIL_TEMPLATE = 'MAIL_TEMPLATE',
    CURRENCY = 'CURRENCY',
    PAYMENT = 'PAYMENT',
    SMS = 'SMS',
    SCHOOL = 'SCHOOL',
}

export interface AppSetup {
    key: string;
    value: string;
    category: SetupCategory;
}
// User Management Types
export interface UserRole {
    roleId: number;
    roleName: string;
    roleDescription: string;
    users: User[];
}

export interface User {
    userId: number;
    fullName: string;
    gender: string;
    userName: string;
    status: string;
    enabled: boolean;
    roles: UserRole[];
}


export interface UserDTO {
    fullName: string;
    gender: string;
    userName: string;
    password?: string;
    status: string;
    enabled: boolean;
    roleIds?: number[];

}
export interface UserRoleDTO {
    roleName: string;
    roleDescription: string;
}

export interface PromotionDTO {
    currentClassId: number;
    nextClassId: number | null; // Null if marking as Alumni
    opcode: 'PROMOTE' | 'ALUMNI';
}

export interface DashboardStatsResponse {
    total_students: number;
    session_students: number;
    transfer_students: number;
    alumni_students: number;
    total_classes: number;
    total_streams: number;
    total_revenue: number;
    total_invoices: number;
    total_balance: number;
    payment_count: number;
    invoice_count: number;
    class_distribution: string;
    monthly_trends: string;
}

export interface Supplier {
    id?: number;
    supplierName: string;
    location: string;
    phone: string;
    taxPin: string;
    type: string;
}

export interface SupplierDTO {
    supplierName: string;
    location: string;
    phone: string;
    taxPin: string;
    type: string;
}



export interface PaymentVoucherDTO {
    voucherNumber: string;
    voucherDate: string; // We'll store the date as a string in 'YYYY-MM-DD' format
    voucherType: "imprest" | "supplier";
    payee?: string | null | undefined;
    supplier?: number | null | undefined;
    amount: number;
    expenseAccount: string | number | undefined;
    fundingAccount: string | number | undefined;
    checkNumber?: string | undefined;
    description: string;
}
//Supplier Invoice DTO

export interface SupplierInvoiceDTO {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    description?: string;
    supplier: string;
    expenseAccount: number;
    fundingAccount: number;
    status: string;
}