package com.ctecx.argosfims.tenant.chartofaccounts;



import java.util.HashMap;
import java.util.Map;

public class AccountCodeGenerator {
    private static final Map<String, Integer> DEFAULT_CODES = new HashMap<>();

    static {
        DEFAULT_CODES.put("ASSETS", 1000);
        DEFAULT_CODES.put("LIABILITIES", 2000);
        DEFAULT_CODES.put("EQUITY", 3000);
        DEFAULT_CODES.put("EXPENSES", 5000);
        DEFAULT_CODES.put("REVENUE", 4000);
    }

    public static int getDefaultCode(AccountGroup accountGroup) {
        return DEFAULT_CODES.get(accountGroup.getParentGroup());
    }
}