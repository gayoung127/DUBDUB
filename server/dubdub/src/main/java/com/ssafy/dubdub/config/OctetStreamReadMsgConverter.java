package com.ssafy.dubdub.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;

@Component
public class OctetStreamReadMsgConverter extends AbstractJackson2HttpMessageConverter {

    @Autowired
    public OctetStreamReadMsgConverter(ObjectMapper objectMapper) {
        // application/octet-stream을 JSON으로 변환하도록 설정
        super(objectMapper, MediaType.APPLICATION_OCTET_STREAM);
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        return false; // JSON을 application/octet-stream으로 변환하는 것은 허용하지 않음 (읽기만 허용)
    }

    @Override
    public boolean canWrite(Type type, Class<?> clazz, MediaType mediaType) {
        return false; // 쓰기 작업을 방지
    }

    @Override
    protected boolean canWrite(MediaType mediaType) {
        return false; // application/octet-stream으로 쓰는 것은 막음
    }
}