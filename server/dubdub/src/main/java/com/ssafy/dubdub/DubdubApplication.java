package com.ssafy.dubdub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableJpaAuditing
@SpringBootApplication
public class DubdubApplication {

	public static void main(String[] args) {
		SpringApplication.run(DubdubApplication.class, args);
	}

}
