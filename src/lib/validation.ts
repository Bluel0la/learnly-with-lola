
import { z } from 'zod';

// Password validation with stronger requirements
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

// Email validation
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(1, 'Email is required');

// Name validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Chat message validation
export const chatMessageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(4000, 'Message must be less than 4000 characters');

// Login form validation
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Signup form validation
export const signupFormSchema = z.object({
  firstname: nameSchema,
  lastname: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Profile update validation
export const profileUpdateSchema = z.object({
  firstname: nameSchema.optional(),
  lastname: nameSchema.optional(),
  educational_level: z.string().max(100).optional(),
  age: z.number().min(13).max(120).optional()
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
