import { ValidationError } from '../utils/errors';

export interface ValidationRules {
  required?: string[];
  nonEmptyArray?: string[];
  positiveInteger?: string[];
}

export function validateBody(body: unknown, rules: ValidationRules): void {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Request body must be a JSON object');
  }

  const obj = body as Record<string, unknown>;
  const errors: string[] = [];

  for (const field of rules.required ?? []) {
    const value = obj[field];
    if (value === undefined || value === null || value === '') {
      errors.push(`${field} is required`);
    }
  }

  for (const field of rules.nonEmptyArray ?? []) {
    const value = obj[field];
    if (!Array.isArray(value) || value.length === 0) {
      errors.push(`${field} must be a non-empty array`);
    }
  }

  for (const field of rules.positiveInteger ?? []) {
    const value = obj[field];
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      errors.push(`${field} must be a positive integer`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`, errors);
  }
}
