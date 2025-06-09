export default {
  // Generic
  REQUIRED_FIELD: (field: string) => `${field} is required.`,
  MUST_BE_STRING: (field: string) => `${field} must be a valid string.`,
  MUST_BE_NUMBER: (field: string) => `${field} must be a valid number.`,
  MUST_BE_ARRAY: (field: string) => `${field} must be a valid array.`,
  MUST_BE_AT_LEAST: (field: string, min: number) =>
    `${field} must be at least ${min}.`,
  MUST_BE_BOOLEAN: (field: string) => `${field} must be true or false.`,
  INVALID_FORMAT: (field: string) => `Invalid format for ${field}.`,

  // Specific
  INVALID_EMAIL: 'Email address is not valid.',
  MIN_LENGTH: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  INVALID_ENUM: (field: string) => `Invalid value for ${field}.`,
  INVALID_ID: (field: string) => `${field} must be a valid UUID.`,
  MUST_BE_DATE: (field: string) => `${field} must be a valid date.`,
  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password.',

  // Database
  ALREADY_EXIST: (entity: string) => `${entity} already exists.`,
  NOT_FOUND_BY_ID: (entity: string, id: string | number) =>
    `${entity} with ID '${id}' not found.`,
  INVALID_RELATION: (entity: string, value: any) =>
    `Referenced ${entity} (${value}) does not exist.`,

  DATABASE_CREATE_ERROR: (entity: string) => `Failed to create ${entity}.`,
  DATABASE_FETCH_ERROR: (entity: string) => `Failed to fetch ${entity}.`,
  DATABASE_FETCH_ERROR_BY_ID: (entity: string, id: string | number) =>
    `Failed to fetch ${entity} with ID '${id}'.`,
  DATABASE_UPDATE_ERROR: (entity: string, id: string | number) =>
    `Failed to update ${entity} with ID '${id}'.`,
  DATABASE_DELETE_ERROR: (entity: string, id: string | number) =>
    `Failed to delete ${entity} with ID '${id}'.`,
  DATABASE_DELETE_ERROR_ARRAY: (entity: string, ids: string[]) =>
    `Failed to delete multiple ${entity} records: ${ids.join(', ')}.`,

  PRISMA_VALIDATION_ERROR: (
    entity: string,
    field: string,
    value: string,
    error: string,
  ) =>
    `Error checking uniqueness for '${entity}.${field}' with value '${value}': ${error}`,
  UNIQUE_CONSTRAINT_FAILED: (entity: string, field: string, value: string) =>
    `The value '${value}' for '${field}' in ${entity} already exists.`,
  PRISMA_ENTITY_NOT_FOUND: (entity: string) =>
    `Entity '${entity}' not found in PrismaClient. Ensure the model name is correct in the validator.`,
  FUTURE_DATE: 'Date and time must be in the future.',
  NOT_FOUND_BY_FIELD: (entity: string, field: string, value: string) =>
    `${entity} not found with ${field}: ${value}`,
  DATABASE_FETCH_ERROR_BY_FIELD: (
    entity: string,
    field: string,
    value: string,
  ) => `Failed to fetch ${entity} by ${field}: ${value}`,
    ALREADY_USED: (field: string) => `${capitalize(field.trim())} already used in database.`,
};
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}