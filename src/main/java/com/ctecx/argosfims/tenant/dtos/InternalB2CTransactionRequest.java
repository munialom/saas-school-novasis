package com.ctecx.argosfims.tenant.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class InternalB2CTransactionRequest{

	@JsonProperty("CommandID")
	private String commandID;

	@JsonProperty("Amount")
	private String amount;

	@JsonProperty("PartyB")
	private String partyB;

	@JsonProperty("Remarks")
	private String remarks;

	@JsonProperty("Occassion")
	private String occassion;
}