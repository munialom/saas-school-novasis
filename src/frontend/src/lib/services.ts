export type ReportItem = { [key: string]: any };

export interface AccountChart {
    id?: number;
    name: string;
    alias: string;
    parent?: AccountChart | null;
    accountGroupEnum: AccountGroup;
    accountGroup: string;
    parentGroup: string;
    accountCode: number;
    bankAccount: boolean;
    receivableAccount?: AccountChart | null;
    linkedBankAccount?: AccountChart | null;
    currencyCode?: string;
    status: boolean;
    key: string;
}

export enum AccountGroup {
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

export interface AccountChartRequest {
    name: string;
    alias: string;
    parentId?: number | null;
    accountGroup: AccountGroup;
    accountGroupText?: string;
    parentGroup?: string;
    bankAccount: boolean;
    linkedBankAccountId?: number | null;
    receivableAccountId?: number | null;
}