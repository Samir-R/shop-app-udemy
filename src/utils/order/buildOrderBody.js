import { addDays, format } from 'date-fns';

const SHOP_ID = '019a8ed6-d371-78f7-8560-9c6508e30fa0';

const ORDER_TYPE_MAP = {
  delivery: 'DELIVERY',
  pickup: 'PICKUP',
  onsite: 'ON_SITE',
};

function buildItemPayload(cartItem) {
  const features = [];
  const menus = [];

  for (const attr of (cartItem.attributesSelected || [])) {
    const entry = {
      items: (attr.listSelected || []).map((s) => ({
        valueId: s.id,
        quantity: s.quantity,
        price: s.price ?? null,
      })),
    };
    if (attr.isFeatureMenu) {
      menus.push({ menuId: attr.id, ...entry });
    } else {
      features.push({ featureId: attr.id, ...entry });
    }
  }

  return {
    productId: cartItem.id,
    quantity: cartItem.quantity,
    price: cartItem.price != null ? String(cartItem.price) : null,
    centPrice: cartItem.centPrice ?? null,
    priceToDisplay: cartItem.priceToDisplay != null ? String(cartItem.priceToDisplay) : null,
    note: cartItem.note ?? null,
    features,
    menus,
  };
}

function applyDiscountsSequentially(itemsSubtotal, sortedPromos) {
  let running = itemsSubtotal;
  for (const promo of sortedPromos) {
    if (promo.discountPercent != null) {
      running -= Math.round(running * promo.discountPercent / 100);
    } else if (promo.discountAmount != null) {
      running -= Math.min(promo.discountAmount, running);
    }
  }
  return running;
}

export function buildOrderBody({
  cartItems,
  cartTotalWithoutPromotions,
  shippingFees,
  promotionsApplied,
  deliveryMethod,
  shop,
  deliveryDate,
  deliveryHour,
  nextDay,
  asap,
  currentAddress,
  currentUser,
  currentUserGuest,
  paymentMethod,
}) {
  const items = cartItems.map(buildItemPayload);
  const itemsSubtotal = cartTotalWithoutPromotions;
  const sortedPromos = [...promotionsApplied].sort((a, b) => a.sort - b.sort);
  const discountIds = sortedPromos.map((p) => p.id);
  const subtotalAfterDiscount = applyDiscountsSequentially(itemsSubtotal, sortedPromos);
  const orderType = ORDER_TYPE_MAP[deliveryMethod] ?? 'PICKUP';
  const grandTotal = subtotalAfterDiscount + shippingFees;

  let estimatedDeliveryAt = null;
  if (!asap && deliveryDate && deliveryHour) {
    let date = new Date(deliveryDate);
    if (nextDay) date = addDays(date, 1);
    const [h, m] = deliveryHour.split(':').map(Number);
    date.setHours(h, m, 0, 0);
    // format local (pas de conversion UTC) — le backend interprète en heure locale
    estimatedDeliveryAt = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }

  // Client connecté : on envoie l'UUID de l'adresse sauvegardée
  const deliveryAddressId = currentUser && currentAddress ? currentAddress.id : null;

  // Client anonyme : on envoie l'adresse inline
  const deliveryAddress =
    !currentUser && orderType === 'DELIVERY' && currentAddress
      ? {
          street1: currentAddress.street1,
          ...(currentAddress.street2 ? { street2: currentAddress.street2 } : {}),
          zipcode: currentAddress.zipcode,
          city: currentAddress.city,
          ...(currentAddress.name ? { name: currentAddress.name } : {}),
          ...(currentAddress.lat != null ? { lat: currentAddress.lat } : {}),
          ...(currentAddress.lng != null ? { lng: currentAddress.lng } : {}),
        }
      : null;

  return {
    shopId: SHOP_ID,
    pointOfSaleId: shop.id,
    orderType,
    deliveryAddressId,
    deliveryAddress,
    estimatedDeliveryAt,
    customerNote: null,
    customerName: `${currentUserGuest?.firstName} ${currentUserGuest?.lastName}`,
    customerEmail: currentUserGuest?.email ?? null,
    customerPhone: currentUserGuest?.phone ?? null,
    items,
    itemsSubtotal,
    deliveryFee: shippingFees,
    discounts: discountIds,
    subtotalAfterDiscount,
    grandTotal,
    paymentMethod: paymentMethod ?? null,
  };
}
