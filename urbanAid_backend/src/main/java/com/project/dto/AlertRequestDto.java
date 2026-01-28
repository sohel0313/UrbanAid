package com.project.dto;

import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class AlertRequestDto {

    private String type;
    private double latitude;
    private double longitude;

}