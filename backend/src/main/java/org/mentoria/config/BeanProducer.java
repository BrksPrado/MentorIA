package org.mentoria.config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;
import jakarta.validation.Validation;

import javax.xml.validation.Validator;

@Singleton
public class BeanProducer {

    @Produces
    @ApplicationScoped
    public Validator produceValidator() {
        return (Validator) Validation.buildDefaultValidatorFactory().getValidator();
    }
}