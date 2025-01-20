package com.ctecx.argosfims.tenant.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterUrlResponse {
	@JsonProperty("OriginatorCoversationID")
	private String originatorConversationID;

	@JsonProperty("ResponseCode")
	private String responseCode;

	@JsonProperty("ResponseDescription")
	private String responseDescription;
}