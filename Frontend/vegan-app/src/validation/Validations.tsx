export const validateUserName = (name: string): boolean => name.trim().length > 2;

export const validateAddress = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

export const validateConfirmPassword = (confirmPassword: string, password: string): boolean =>
  confirmPassword === password;
