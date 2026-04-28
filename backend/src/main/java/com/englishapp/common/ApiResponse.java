package com.englishapp.common;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@JsonPropertyOrder({ "success", "data", "message" })
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
}
