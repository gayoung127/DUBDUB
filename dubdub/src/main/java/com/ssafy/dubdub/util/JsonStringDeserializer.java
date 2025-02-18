package com.ssafy.dubdub.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonStringDeserializer extends JsonDeserializer<String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String deserialize(JsonParser jsonParser, DeserializationContext ctxt) throws IOException {
        return objectMapper.writeValueAsString(objectMapper.readTree(jsonParser));
    }
}
