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
    public Queue studioTrackQueue() {
        return new Queue("studio.track.queue", true);
    }

    @Bean
    public Queue studioAssetQueue() {
        return new Queue("studio.asset.queue", true);
    }

    @Bean
    public Queue studioCursorQueue() {
        return new Queue("studio.cursor.queue", true);
    }

    @Bean
    public DirectExchange studioExchange() {
        return new DirectExchange("studio.exchange");
    }

    @Bean
    public Binding trackBinding() {
        return BindingBuilder.bind(studioTrackQueue())
                .to(studioExchange())
                .with("studio.track");
    }

    @Bean
    public Binding assetBinding() {
        return BindingBuilder.bind(studioAssetQueue())
                .to(studioExchange())
                .with("studio.asset");
    }

    @Bean
    public Binding cursorBinding() {
        return BindingBuilder.bind(studioCursorQueue())
                .to(studioExchange())
                .with("studio.cursor");
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