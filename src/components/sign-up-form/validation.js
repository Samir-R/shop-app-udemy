import { z } from 'zod';
import { passwordSchema } from './password-fields.component';

// Schéma de base pour le registre (sans les mots de passe)
const baseRegisterSchema = z.object({
  email: z
    .email("Email invalide")
    .min(1, "L'email est requis"),

  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),

  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val.replace(/\s/g, '')), {
      message: 'Numéro de téléphone invalide (10 chiffres)',
    }),

  newsletterSubscribed: z.boolean().optional(),
});

// Schéma pour l'édition des infos user (sans password)
export const editUserSchema = baseRegisterSchema;

// Fusion avec destructuring comme recommandé dans la doc Zod v4
export const registerSchema = z.object({
  ...baseRegisterSchema.shape,
  ...passwordSchema.shape,
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
});

export const loginSchema = z.object({
  email: z
    .email("Email invalide")
    .min(1, "L'email est requis"),

  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
});
