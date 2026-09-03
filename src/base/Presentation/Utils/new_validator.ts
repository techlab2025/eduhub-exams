export type ValidationItem = {
  key: string;
  message: string;
  validator: () => boolean;
};

export type ValidationError = {
  key: string;
  message: string;
};

export const ValidationHandler = (validations: ValidationItem[]): ValidationError[] => {
  return validations
    .filter((item) => !item.validator())
    .map((item) => ({
      key: item.key,
      message: item.message,
    }));
};

