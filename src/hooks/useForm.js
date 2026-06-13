import { useState, useCallback } from 'react'

export function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((fieldValues = values) => {
    const newErrors = {}
    Object.keys(validationRules).forEach(key => {
      const rule = validationRules[key]
      const value = fieldValues[key]
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[key] = rule.message || `${key} is required`
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[key] = rule.patternMessage || `Invalid ${key} format`
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[key] = rule.minLengthMessage || `${key} must be at least ${rule.minLength} characters`
      } else if (rule.custom && value) {
        const customError = rule.custom(value, fieldValues)
        if (customError) newErrors[key] = customError
      }
    })
    return newErrors
  }, [values, validationRules])

  const handleChange = useCallback((field, value) => {
    const newValues = { ...values, [field]: value }
    setValues(newValues)
    if (touched[field]) {
      const newErrors = validate(newValues)
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [values, touched, validate])

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const newErrors = validate()
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
  }, [validate])

  const handleSubmit = useCallback(async (onSubmit) => {
    const newErrors = validate()
    setErrors(newErrors)
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
    if (Object.keys(newErrors).length > 0) return false
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      return true
    } catch {
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate])

  const reset = useCallback((newValues) => {
    setValues(newValues || initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = Object.keys(validate()).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    reset,
    setErrors
  }
}
