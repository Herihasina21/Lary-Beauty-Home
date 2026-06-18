"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { submitContactFormAction } from "@/app/contact/actions";
import { servicesData as fallbackServices } from "@/data/services";
import { iconNameFromComponent } from "@/lib/icons";
import {
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
import type { ContactInfo, SerializedServiceCategory } from "@/types";

type FormState = {
  submitting: boolean;
  succeeded: boolean;
  trackingToken: string | null;
  errors: { form?: string } | null;
};

const fallbackCategories: SerializedServiceCategory[] = fallbackServices.map(function (cat) {
  return {
    id: cat.id,
    title: cat.title,
    icon: iconNameFromComponent(cat.icon),
    services: cat.services,
  };
});

export function useContactForm({
  servicesData = fallbackCategories,
  formspreeFormId = "",
}: {
  servicesData?: SerializedServiceCategory[];
  formspreeFormId?: string;
}) {
  const [state, setState] = useState<FormState>({
    submitting: false,
    succeeded: false,
    trackingToken: null,
    errors: null,
  });
  const [values, setValues] = useState<ContactFormValues>(contactFormInitialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});

  const setField = <K extends keyof ContactFormValues>(k: K, v: ContactFormValues[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k] || k === "date") {
      setErrors(validateContactStep(next.step, next));
    }
  };

  const blur = (k: keyof ContactFormValues) => {
    setTouched({ ...touched, [k]: true });
    setErrors(validateContactStep(values.step, values));
  };

  const setCategory = (categoryId: ContactCategoryId) => {
    const next: ContactFormValues = {
      ...values,
      categoryId: categoryId,
      serviceId: "",
      serviceLabel: categoryId === "autre" ? "Autre / à discuter" : "",
    };
    setValues(next);
    setErrors(validateContactStep(next.step, next));
    setTouched({ ...touched, categoryId: true });
  };

  const selectService = (serviceId: string) => {
    const label = resolveServiceLabel(values.categoryId, serviceId, servicesData);
    const next = { ...values, serviceId: serviceId, serviceLabel: label };
    setValues(next);
    setErrors(validateContactStep(next.step, next));
    setTouched({ ...touched, serviceId: true });
  };

  const goToStep = (step: ContactFormStep) => {
    setValues({ ...values, step: step });
    setErrors({});
  };

  const nextStep = () => {
    const stepErrors = validateContactStep(values.step, values);
    const stepKeys: (keyof ContactFormValues)[] =
      values.step === 1
        ? ["categoryId"]
        : values.step === 2
          ? ["serviceId"]
          : values.step === 3
            ? ["date", "message"]
            : ["name", "phone", "email"];

    const nextTouched = { ...touched };
    stepKeys.forEach(function (k) {
      nextTouched[k] = true;
    });
    setTouched(nextTouched);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) return;

    let nextStepNum = values.step + 1;
    if (values.step === 1 && values.categoryId === "autre") {
      nextStepNum = 3;
    }
    if (nextStepNum <= 4) {
      goToStep(nextStepNum as ContactFormStep);
    }
  };

  const prevStep = () => {
    let prevStepNum = values.step - 1;
    if (values.step === 3 && values.categoryId === "autre") {
      prevStepNum = 1;
    }
    if (prevStepNum >= 1) {
      goToStep(prevStepNum as ContactFormStep);
    }
  };

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eMap = validateContactForm(values);
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

    setState({ submitting: true, succeeded: false, trackingToken: null, errors: null });
    const result = await submitContactFormAction(values, servicesData, formspreeFormId);
    if (result.success) {
      setState({
        submitting: false,
        succeeded: true,
        trackingToken: result.trackingToken ?? null,
        errors: null,
      });
      return;
    }
    setState({
      submitting: false,
      succeeded: false,
      trackingToken: null,
      errors: { form: result.error ?? "Une erreur est survenue." },
    });
  };

  const fieldError = (key: keyof ContactFormValues) =>
    touched[key] ? errors[key] : undefined;

  const categoryServices = getCategoryServices(values.categoryId, servicesData);

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
