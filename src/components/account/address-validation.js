import { z } from 'zod';

/**
 * Schéma de validation pour les adresses
 */
export const addressSchema = z.object({
  name: z
    .string()
    .min(1, 'Le libellé est requis')
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(50, 'Le libellé ne peut pas dépasser 50 caractères'),

  street1: z
    .string()
    .min(1, 'L\'adresse est requise')
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(100, 'L\'adresse ne peut pas dépasser 100 caractères'),

  street2: z
    .string()
    .max(100, 'L\'adresse ligne 2 ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .min(1, 'La ville est requise')
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(50, 'La ville ne peut pas dépasser 50 caractères'),

  zipcode: z
    .string()
    .min(1, 'Le code postal est requis')
    .regex(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres'),

  country: z
    .string()
    .min(1, 'Le pays est requis')
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(50, 'Le pays ne peut pas dépasser 50 caractères'),

  isFavorite: z.boolean().optional(),
});
