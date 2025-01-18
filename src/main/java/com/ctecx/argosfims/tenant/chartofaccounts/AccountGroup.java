package com.ctecx.argosfims.tenant.chartofaccounts;

import java.util.Arrays;

public enum AccountGroup {
    // Asset categories
    CURRENT_ASSETS("Current Assets", "ASSETS"),
    FIXED_ASSETS("Fixed Assets", "ASSETS"),
    LONG_TERM_INVESTMENTS("Long-term Investments", "ASSETS"),
    OTHER_ASSETS("Other Assets", "ASSETS"),

    // Liability categories
    CURRENT_LIABILITIES("Current Liabilities", "LIABILITIES"),
    LONG_TERM_LIABILITIES("Long-term Liabilities", "LIABILITIES"),

    // Equity categories
    SHARE_CAPITAL("Share Capital", "EQUITY"),
    RETAINED_EARNINGS("Retained Earnings", "EQUITY"),

    // Revenue categories
    OPERATING_REVENUE("Operating Revenue", "REVENUE"),
    NON_OPERATING_REVENUE("Non-operating Revenue", "REVENUE"),

    // Expense categories
    OPERATING_EXPENSES("Operating Expenses", "EXPENSES"),
    NON_OPERATING_EXPENSES("Non-operating Expenses", "EXPENSES"),
    COST_OF_GOODS_SOLD("Cost of Goods Sold", "EXPENSES");

    private final String displayText;
    private final String parentGroup;

    AccountGroup(String displayText, String parentGroup) {
        this.displayText = displayText;
        this.parentGroup = parentGroup;
    }

    public String getDisplayText() {
        return displayText;
    }

    public String getParentGroup() {
        return parentGroup;
    }

    public boolean isRevenue() {
        return this == OPERATING_REVENUE || this == NON_OPERATING_REVENUE;
    }


    public static AccountGroup[] getSubgroups(String parentGroup) {
        return Arrays.stream(values())
                .filter(group -> group.getParentGroup().equals(parentGroup))
                .toArray(AccountGroup[]::new);
    }
}