---
name: Intégration paiement Stripe + annulation + confirmation
description: Stripe PaymentElement, annulation commande, page confirmation, accès anonyme getOrder
type: project
---

## Stripe PaymentElement

- `src/components/checkout/steps/StripePaymentStep.jsx` — composant complet
- `loadStripe` avec `stripeAccount` (Stripe Connect), `useMemo` sur stripePromise
- `redirect: 'if_required'` dans `confirmPayment` → succès inline, redirect rare
- Pays hardcodé `'FR'` : `defaultValues` dans `<Elements>`, `fields: { billingDetails: { address: { country: 'never' } } }` dans `<PaymentElement>`, `payment_method_data` dans `confirmPayment`
- `orderTotal` affiché au-dessus du formulaire (en centimes → divisé par 100, formaté `fr-FR`)

**Why:** Stripe Connect nécessite stripeAccount, redirect:if_required évite une page redirect pour la majorité des cartes.

## Annulation commande

- Deux points d'annulation : `StripePaymentStep` (abandon paiement) et `order-detail.component.jsx`
- Les deux ont un Dialog de confirmation + Snackbar succès avant redirect
- `ButtonDanger` créé dans `src/components/common/ButtonDanger.jsx` (bg #e74c3c, hover #c0392b) — à utiliser partout pour boutons destructifs rouges
- Statuts annulables : `PENDING` et `CONFIRMED`

## Layout checkout step Stripe

- Cart masqué à `activeStep === 3` (colonne droite `display: 'none'`)
- Colonne stepper passe à `md={12}` à l'étape 3
- Overlay loader (`isProcessingOrder`) sur la `<Card>` : s'active après `createOrder` réussi + paiement ONLINE, pendant `createPaymentIntent`. `backdropFilter: blur(4px)` + `rgba(255,255,255,0.82)`. Se désactive avant `setActiveStep(3)` ou dans le catch.

## getOrder anonyme

- `orderService.getOrder(orderId, email = null)` — ajoute `?email=...` en query param si email fourni
- `CheckoutStepper.handlePaymentSuccess` passe `currentUserGuest?.email`
- `sessionStorage.setItem('guestEmail', email)` dans `onSubmit` avant Stripe (ONLINE uniquement)
- `OrderConfirmation.jsx` efface `sessionStorage.removeItem('guestEmail')` au montage
- `OrderConfirmationPage.jsx` lit `sessionStorage.getItem('guestEmail')` pour le fallback redirect Stripe

**Why:** Backend modifié pour accepter les commandes anonymes via email en query param. Les commandes de clients connectés restent inaccessibles via email (sécurité).
