package com.ctecx.argosfims.tenant.ipns;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class IPNTransactionEvent extends ApplicationEvent {
    private final IPNTransaction ipnTransaction;

    public IPNTransactionEvent(Object source, IPNTransaction ipnTransaction) {
        super(source);
        this.ipnTransaction = ipnTransaction;
    }
}