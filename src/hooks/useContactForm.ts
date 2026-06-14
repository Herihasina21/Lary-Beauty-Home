"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useForm } from "@formspree/react";
import { servicesData } from "@/data/services";
import {
  buildFormspreePayload,
  contactFormInitialValues,
  getCategoryServices,
  resolveServiceLabel,
  validateContactForm,
  validateContactStep,
  type ContactCategoryId,
  type ContactFormErrors,
  type ContactFormStep,
  type ContactFormValues,
} from "@/lib/contact-form";

export function useContactForm() {
  var formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? "";
  var [state, handleFormspreeSubmit] = useForm(formspreeId);
  var [values, setValues] = useState<ContactFormValues>(contactFormInitialValues);
  var [errors, setErrors] = useState<ContactFormErrors>({});
  var [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});

  var setField = <K extends keyof ContactFormValues>(k: K, v: ContactFormValues[K]) => {
    var next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validateContactStep(next.step, next));
  };

  var blur = (k: keyof ContactFormValues) => {
    setTouched({ ...touched, [k]: true });
    setErrors(validateContactStep(values.step, values));
  };

  var setCategory = (categoryId: ContactCategoryId) => {
    var next: ContactFormValues = {
      ...values,
      categoryId: categoryId,
      serviceId: "",
      serviceLabel: categoryId === "autre" ? "Autre / à discuter" : "",
    };
    setValues(next);
    setErrors(validateContactStep(next.step, next));
    setTouched({ ...touched, categoryId: true });
  };

  var selectService = (serviceId: string) => {
    var label = resolveServiceLabel(values.categoryId, serviceId, servicesData);
    var next = { ...values, serviceId: serviceId, serviceLabel: label };
    setValues(next);
    setErrors(validateContactStep(next.step, next));
    setTouched({ ...touched, serviceId: true });
  };

  var goToStep = (step: ContactFormStep) => {
    setValues({ ...values, step: step });
    setErrors({});
  };

  var nextStep = () => {
    var stepErrors = validateContactStep(values.step, values);
    var stepKeys: (keyof ContactFormValues)[] =
      values.step === 1
        ? ["categoryId"]
        : values.step === 2
          ? ["serviceId"]
          : values.step === 3
            ? ["name", "phone", "email"]
            : ["date", "message"];

    var nextTouched = { ...touched };
    stepKeys.forEach(function (k) {
      nextTouched[k] = true;
    });
    setTouched(nextTouched);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) return;

    var nextStepNum = values.step + 1;
    if (values.step === 1 && values.categoryId === "autre") {
      nextStepNum = 3;
    }
    if (nextStepNum <= 4) {
      goToStep(nextStepNum as ContactFormStep);
    }
  };

  var prevStep = () => {
    var prevStepNum = values.step - 1;
    if (values.step === 3 && values.categoryId === "autre") {
      prevStepNum = 1;
    }
    if (prevStepNum >= 1) {
      goToStep(prevStepNum as ContactFormStep);
    }
  };

  var onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    var eMap = validateContactForm(values);
    setErrors(eMap);
    setTouched({
      step: true,
      categoryId: true,
      serviceId: true,
      serviceLabel: true,
      name: true,
      phone: true,
      email: true,
      date: true,
      message: true,
    });
    if (Object.keys(eMap).length > 0) return;
    handleFormspreeSubmit(buildFormspreePayload(values, servicesData));
  };

  var fieldError = (key: keyof ContactFormValues) =>
    touched[key] ? errors[key] : undefined;

  var categoryServices = getCategoryServices(values.categoryId, servicesData);

  return {
    state,
    values,
    errors,
    setField,
    blur,
    setCategory,
    selectService,
    nextStep,
    prevStep,
    onSubmit,
    fieldError,
    categoryServices,
    servicesData,
  };
}
