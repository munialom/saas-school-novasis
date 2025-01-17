package com.ctecx.argosfims.tenant.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ResultParameters{

	@JsonProperty("ResultParameter")
	private List<ResultParameterItem> resultParameter;
}