package com.ssafy.dubdub.util.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Aspect
@Component
public class LogAspect {

    /**
     * ✅ 모든 컨트롤러의 메서드 실행 전 요청 로깅
     */
    @Before("execution(* com.ssafy.dubdub.controller..*Controller.*(..))")
    public void logBefore(JoinPoint joinPoint) {

        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        if (args.length == 0) {
            log.info("[{}] - [START]", methodName);
        } else {
            log.info("[{}] - [START] - [요청 파라미터]: {}", methodName, args);
        }
    }

    /**
     * ✅ 컨트롤러의 메서드 실행 후 응답 로깅
     */
    @AfterReturning(pointcut = "execution(* com.ssafy.dubdub.controller..*Controller.*(..))", returning = "result")
    public void logAfterMethod(JoinPoint joinPoint, Object result) {

        String methodName = joinPoint.getSignature().getName();

        if (result == null) {
            log.info("[{}] - [END] - 응답 값: null", methodName);
        } else if (result instanceof ModelAndView modelAndView) {
            log.info("[{}] - [END] - 뷰 이름: {}, 모델 데이터: {}", methodName, modelAndView.getViewName(), modelAndView.getModel());
        } else {
            log.info("[{}] - [END] - 응답 값: {}", methodName, result);
        }
    }

    /**
     * ✅ 컨트롤러에서 예외 발생 시 로깅
     */
    @AfterThrowing(pointcut = "execution(* com.ssafy.dubdub.controller..*Controller.*(..))", throwing = "ex")
    public void logAfterException(JoinPoint joinPoint, Exception ex) {
        log.error("[{}] - [EXCEPTION 발생] - 메시지: {}", joinPoint.getSignature().getName(), ex.getMessage(), ex);
    }
}
