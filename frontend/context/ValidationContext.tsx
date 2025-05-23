import React, { createContext, useContext, ReactNode } from "react";
import * as yup from "yup";
// Define form data types
export interface SignUpFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  usernameOrEmail: string;
  password: string;
}
interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface passwordVerificationCodeData {
  verificationCode: string;
}

// Define the context type
interface ValidationContextType {
  signUpSchema: yup.ObjectSchema<SignUpFormData>;
  signInSchema: yup.ObjectSchema<SignInFormData>;
  forgotPasswordSchema: yup.ObjectSchema<ForgotPasswordFormData>;
  resetPasswordSchema: yup.ObjectSchema<ResetPasswordFormData>;
  passwordVerificationCodeSchema: yup.ObjectSchema<passwordVerificationCodeData>;
  emailVerificationCodeSchema: yup.ObjectSchema<passwordVerificationCodeData>;
}

interface ValidationProviderProps {
  children: ReactNode;
}
// Create the context
const ValidationContext = createContext<ValidationContextType | undefined>(
  undefined
);

// Regex patterns
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const userNamePattern = /^[a-zA-Z0-9_]+$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validation schemas
const signUpSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(
      userNamePattern,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: yup
    .string()
    .required("Email is required")
    .matches(emailPattern, "Please enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordPattern,
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const signInSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required("Username or email is required")
    .test("isUsernameOrEmail", "Enter a valid username or email", (value) => {
      if (!value) return false;
      // Check if the value matches either email or username pattern
      return emailPattern.test(value) || userNamePattern.test(value);
    }),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

const emailVerificationCodeSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, "Code must be exactly 6 digits")
    .required("Verification code is required"),
});

const passwordVerificationCodeSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, "Code must be exactly 6 digits")
    .required("Verification code is required"),
});
export const ValidationProvider: React.FC<ValidationProviderProps> = ({
  children,
}) => {
  return (
    <ValidationContext.Provider
      value={{
        signUpSchema,
        signInSchema,
        emailVerificationCodeSchema,
        forgotPasswordSchema,
        resetPasswordSchema,
        passwordVerificationCodeSchema,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
};
