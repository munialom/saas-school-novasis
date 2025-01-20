package com.ctecx.argosfims.tenant.ipns;

public interface IPNTransactionService {
    IPNResponse processIPNTransaction(IPNRequest ipnRequest, String signature);
}