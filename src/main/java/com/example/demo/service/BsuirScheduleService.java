package com.example.demo.service;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BsuirScheduleService {
    private final RestTemplate restTemplate;
    private final String API_URL = "https://iis.bsuir.by/api/v1/schedule";

    public BsuirScheduleService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String getGroupSchedule(String groupNumber) {
        String url = API_URL + "?studentGroup=" + groupNumber;
        return restTemplate.getForObject(url, String.class);
    }
}
