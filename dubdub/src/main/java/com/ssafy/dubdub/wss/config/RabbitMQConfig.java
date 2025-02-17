package com.ssafy.dubdub.wss.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue studioEditQueue() {
        return new Queue("studio.edit.queue", true);
    }

    @Bean
    public DirectExchange studioExchange() {
        return new DirectExchange("studio.exchange");
    }

    @Bean
    public Binding binding(Queue studioEditQueue, DirectExchange studioExchange) {
        return BindingBuilder.bind(studioEditQueue)
                .to(studioExchange)
                .with("studio.edit");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}