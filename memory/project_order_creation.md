---
name: Implémentation création de commande
description: Ce qui a été implémenté pour la création de commande via l'API backend Symfony
type: project
---

## Contexte
Application React (food order app). Backend Symfony. API REST JSON. Base URL : `https://localhost:4437/api`.

## Ce qui a été implémenté (session 2026-05-02 → 2026-05-16)

### Architecture des données pour une commande
- `shopId` : hardcodé `019a8ed6-d371-78f7-8560-9c6508e30fa0` (dans `buildOrderBody.js`)
- `pointOfSaleId` : `shop.id` depuis `ShopShippingContext`
- `orderType` : mapping `deliveryMethod` → `DELIVERY/PICKUP/ON_SITE`
- Les `attributesSelected` d'un cart item sont splittés en `features[]` (isFeatureMenu=false) et `menus[]` (isFeatureMenu=true)

### Fichiers créés
- `src/utils/order/buildOrderBody.js` — helper pur qui construit le body API complet
- `src/components/order/OrderDetailView.jsx` — sous-composant affichage commande (prend prop `order: Order`)
- `src/components/checkout/CartErrorsModal.jsx` — Dialog MUI récapitulatif des erreurs panier

### Fichiers modifiés
- `src/services/json-server/order.service.js` — ajout `createOrder(body)` avec Content-Type: application/json
- `src/contexts/cart.context.jsx` — ajout `removeCartItemsByProductId`, `setCartItemQuantity`, `clearCart`
- `src/contexts/product.context.jsx` — ajout `refreshProducts()` exposé dans le contexte
- `src/components/checkout/CheckoutStepper.jsx` — `onSubmit` appelle l'API, `handleCartErrors` enrichit les erreurs avec noms produits AVANT de modifier le panier, ouvre CartErrorsModal, appelle refreshProducts
- `src/components/order/order-detail.component.jsx` — refactorisé pour utiliser OrderDetailView
- `src/components/checkout/OrderConfirmation.jsx` — réécrit : Alert success + OrderDetailView + bouton "Suivre mes commandes" (connecté) ou Alert info inscription (anonyme)

### Gestion des erreurs API (codes)
PRODUCT_NOT_FOUND/UNAVAILABLE/PRICE_MISMATCH/INVALID_OPTION → removeCartItemsByProductId
OUT_OF_STOCK available=0 → remove, available>0 → setCartItemQuantity
INVALID_PROMO → removePromotion
TOTAL_MISMATCH → ignoré (auto-résolu)
INVALID_OPTION → bouton "Retour au menu" (navigate('/')) dans CartErrorsModal

### Flux onSubmit
1. buildOrderBody() → POST /api/v1/customer/orders
2. Succès → new Order(result.order) → clearCart() → clearFormData() → OrderConfirmation
3. Erreur tableau → handleCartErrors → CartErrorsModal
4. Erreur objet → setErrorInStep (validation simple)

**Why:** Implémentation complète de la création commande avant passage au paiement Stripe.
**How to apply:** shopId hardcodé à changer quand il sera dynamique. CheckoutContext est obsolète (tout est dans ShopShippingContext).
