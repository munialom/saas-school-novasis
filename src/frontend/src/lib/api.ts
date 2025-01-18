import axios, { AxiosResponse } from 'axios';
import {
    StudentDTO,
    ParentDetails,
    ClassUpdateDTO,
    StreamUpdateDTO,
    StreamDeleteDTO,
    ClassDeleteDTO,
    AccountChartRequest,
    AccountChart,
    ChartOfAccountUpdateDTO,
    RevenueAccount,
    BulkInvoiceRequest,
    StudentTransactionSummary,
    AccountBalance,
    PaymentRequest,
    PaymentSummaryResponse,
    ClassSummaryResponse,
    DateSummaryResponse,
    BankSummaryResponse,
    TransactionReportItem,
    InvoicedReportItem,
    PaymentReportItem,
    UserDTO,
    User,
    UserRole,
    UserRoleDTO,
    SetupCategory,
    AppSetup,
    PromotionDTO,
    DashboardStatsResponse,
    SupplierDTO,
    Supplier,
    SupplierInvoiceDTO,
    PaymentVoucherDTO,
    ReportItem,
    AccountChartResponse,
    ProjectDTO,
    PaymentVoucherResponse,
    SupplierInvoiceResponse
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

//New API call for toggle student status
export const toggleStudentStatus = async (studentId: number): Promise<any> => {
    try {
        return await axios.put(
            `${getApiBaseUrl()}/api/v1/school/students/${studentId}/status`,
            {},
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


// New API call to delete student
export const deleteStudent = async (studentId: number): Promise<any> => {
    try {
        return await axios.delete(
            `${getApiBaseUrl()}/api/v1/school/students/${studentId}`,
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

export const searchStudentsWithPagination = async (searchTerm: string, pageNumber: number): Promise<AxiosResponse> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/school/students/search`, {
            ...getAuthConfig(),
            params: {
                searchTerm: searchTerm,
                pageNumber: pageNumber,
            },
        });
    } catch (error) {
        throw error;
    }
};

//New API call to save Account Chart
export const saveAccountChart = async (accountChart: AccountChartRequest): Promise<AxiosResponse<string>> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/v1/accounts`,
            accountChart,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

// New API calls for accounts (all accounts)
export const fetchChartOfAccounts = async (): Promise<AxiosResponse<AccountChart[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/accounts`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const fetchChartOfAccountsJason = async (): Promise<AxiosResponse<AccountChartResponse[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/finance/accounts`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};
export const deleteChartOfAccount = async (accountId: number): Promise<AxiosResponse<any>> => {
    try {
        return await axios.delete(`${getApiBaseUrl()}/api/v1/finance/accounts/${accountId}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
}

export const updateChartOfAccount = async (account: ChartOfAccountUpdateDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/v1/finance/accounts`, account, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


// New API call for bank accounts
export const getBankAccounts = async (): Promise<AxiosResponse<AccountChart[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/finance/bank-accounts`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

//New API call for revenue accounts
export const getRevenueAccounts = async (): Promise<AxiosResponse<RevenueAccount[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/finance/revenue-accounts`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


export const getStudentTransactionSummary = async (studentId: number | null): Promise<AxiosResponse<StudentTransactionSummary[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/student-transactions/${studentId !== null ? studentId : ""}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};
//New API call to get Account Chart balances for a student
export const getAccountChartBalancesByStudentId = async (studentId: number): Promise<AxiosResponse<AccountBalance[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/accounts/student/${studentId}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


export const processBulkInvoice = async (bulkInvoice: BulkInvoiceRequest): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/accounting/recordStudentBulkInvoice`,
            bulkInvoice,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};
export const processPayment = async (payment: PaymentRequest): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/accounting/recordStudentPayment`,
            payment,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

// New API calls for finance reports
export const getPaymentSummary = async (startDate: string, endDate: string): Promise<AxiosResponse<PaymentSummaryResponse>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/payments-summary/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getClassSummary = async (startDate: string, endDate: string): Promise<AxiosResponse<ClassSummaryResponse>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/summary-by-class/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getDateSummary = async (startDate: string, endDate: string): Promise<AxiosResponse<DateSummaryResponse>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/summary-by-date/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getBankSummary = async (startDate: string, endDate: string): Promise<AxiosResponse<BankSummaryResponse>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/summary-by-bank/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};
//new api calls to get transaction data
export const getTransactionsByStudent = async (studentId: number | null): Promise<AxiosResponse<TransactionReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/transactions/student/${studentId !== null ? studentId : ""}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}
export const getInvoicedTransactionsByStudent = async (studentId: number | null): Promise<AxiosResponse<InvoicedReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/invoiced-transactions/student/${studentId !== null ? studentId : ""}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}
export const getPaymentTransactionsByStudent = async (studentId: number | null): Promise<AxiosResponse<PaymentReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/payment-transactions/student/${studentId !== null ? studentId : ""}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}


// System Setup Specific

// System Setup Specific

export const getSettingsByCategory = async (category: SetupCategory): Promise<AxiosResponse<Record<string, string>>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/settings/map/${category}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const updateSetting = async (setting: AppSetup): Promise<AxiosResponse<string>> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/settings/update`, setting, getAuthConfig());
    } catch (error) {
        throw error;
    }
};
// new API calls for user roles
export const getUsers = async (): Promise<AxiosResponse<User[]>> => {
    try {
        const response =  await axios.get(`${getApiBaseUrl()}/api/users`,getAuthConfig());
        // Remove password from each user in the response
        const users = response.data.map((user:any) => {
            const {password, ...userWithoutPassword} = user;
            return userWithoutPassword;
        })


        return {
            ...response,
            data:users
        }
    } catch (error) {
        throw error;
    }
};
export const getRoles = async (): Promise<AxiosResponse<UserRole[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/user-roles`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


export const saveUser = async (user: UserDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(`${getApiBaseUrl()}/api/users`,user, getAuthConfig());
    } catch (error) {
        throw error;
    }
};
export const saveRole = async (role: UserRoleDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(`${getApiBaseUrl()}/api/user-roles`,role, getAuthConfig());
    } catch (error) {
        throw error;
    }
};
export const updateUser = async (id:number, user: UserDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/users/${id}`,user, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<AxiosResponse<any>> => {
    try {
        return await axios.delete(`${getApiBaseUrl()}/api/users/${id}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const promoteStudentsApi = async (promotionDTO: PromotionDTO): Promise<any> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/student/promotion/promote`, // Your controller endpoint
            promotionDTO,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};



type ApiResponse<T> = AxiosResponse<T>;

export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/school/statistics`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};


/*export const getDashboardStats = async (): Promise<AxiosResponse<DashboardStatsResponse>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/school/statistics`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};*/


// New API call for generating a student report
export const generateStudentReport = async (classId: number, streamId: number, admission: string): Promise<AxiosResponse<Blob>> => {
    try {
        const response = await axios.get(
            `${getApiBaseUrl()}/reports/students/${classId}/${streamId}/${admission}`,
            {
                ...getAuthConfig(),
                responseType: 'blob' // Indicate that we expect a blob (PDF) as response
            }
        );
        return response
    } catch (error) {
        throw error;
    }
};

// New API calls for suppliers
export const getSuppliers = async (): Promise<AxiosResponse<Supplier[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/suppliers`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const saveSupplier = async (supplier: SupplierDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(`${getApiBaseUrl()}/api/suppliers`,supplier, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const updateSupplier = async (id:number, supplier: SupplierDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/suppliers/${id}`,supplier, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const deleteSupplier = async (id: number): Promise<AxiosResponse<any>> => {
    try {
        return await axios.delete(`${getApiBaseUrl()}/api/suppliers/${id}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


// New API call for save payment voucher
export const savePaymentVoucher = async (voucher: PaymentVoucherDTO): Promise<AxiosResponse<any>> => {
    try {
        console.log('Voucher Data:', voucher); // Log the data being sent

        return await axios.post(
            `${getApiBaseUrl()}/api/accounting/recordPaymentVoucher`,
            voucher,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};
// New API call for save supplier invoice
export const saveSupplierInvoice = async (invoice: SupplierInvoiceDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(
            `${getApiBaseUrl()}/api/accounting/recordSupplierInvoice`,
            invoice,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

// New API call to fetch grouped chart of accounts
export const getGroupedChartOfAccounts = async (): Promise<AxiosResponse<Record<string,AccountChart[]>>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/v1/accounts/grouped`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};




//Account Charts
export const getChartOfAccountsData = async (): Promise<AxiosResponse<ReportItem[]>> => {
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


// New API Calls to get the new reports
export const getTrialBalanceReport = async (startDate: string, endDate: string): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/trial-balance/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getIncomeStatementReport = async (startDate: string, endDate: string): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/income-statement/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getCashFlowStatementReport = async (startDate: string, endDate: string): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/cash-flow-statement/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getCashBookReport = async (startDate: string, endDate: string): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/cash-book/${startDate}/${endDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getBalanceSheetReport = async (asOfDate: string): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/balance-sheet/${asOfDate}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};

export const getLedgerTransactionsReport = async (startDate: string, endDate: string, accountChartId: number): Promise<AxiosResponse<ReportItem[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/ledger-transactions/${startDate}/${endDate}/${accountChartId}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


//New API call to print receipt
export const printReceiptApi = async (serialNumber:string): Promise<AxiosResponse<Blob>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/receipts/generate/${serialNumber}`,
            {
                ...getAuthConfig(),
                responseType: 'blob'
            })

    } catch (error) {
        throw error;
    }
};


// New API calls for projects
// Corrected API method to return a single ProjectDTO
export const getProjects = async (): Promise<AxiosResponse<ProjectDTO[]>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/projects`, getAuthConfig()); //return the array now
    } catch (error) {
        throw error;
    }
};
export const saveProject = async (project: ProjectDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.post(`${getApiBaseUrl()}/api/projects`,project, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const updateProject = async (id:number, project: ProjectDTO): Promise<AxiosResponse<any>> => {
    try {
        return await axios.put(`${getApiBaseUrl()}/api/projects/${id}`,project, getAuthConfig());
    } catch (error) {
        throw error;
    }
};

export const deleteProject = async (id: number): Promise<AxiosResponse<any>> => {
    try {
        return await axios.delete(`${getApiBaseUrl()}/api/projects/${id}`, getAuthConfig());
    } catch (error) {
        throw error;
    }
};


export const getPaymentVouchers = async (): Promise<AxiosResponse<PaymentVoucherResponse[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/payment-vouchers`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


export const getSupplierInvoices = async (): Promise<AxiosResponse<SupplierInvoiceResponse[]>> => {
    try {
        return await axios.get(
            `${getApiBaseUrl()}/api/v1/finance/supplier-invoices`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
};


export const printVoucherApi = async (voucherNumber:string): Promise<AxiosResponse<Blob>> => {
    try {
        return await axios.get(`${getApiBaseUrl()}/api/vouchers/generate/${voucherNumber}`,
            {
                ...getAuthConfig(),
                responseType: 'blob'
            })

    } catch (error) {
        throw error;
    }
};