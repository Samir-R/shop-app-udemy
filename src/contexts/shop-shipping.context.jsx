import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, format, getDay, isBefore, isSameDay, parseISO } from 'date-fns';
import services from '../services';

const STORAGE_KEY = 'shop_shipping_prefs';

// Fallback mock data used when the API is unavailable
const MOCK_SHOPS = [
  {
    id: '1',
    name: 'Burger Palace',
    address: '123 Avenue des Champs-Élysées, Paris',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500',
    cuisine: 'Burgers',
    rating: 4.5,
    deliveryTime: 25,
    optionsAvailable: ['delivery', 'pickup', 'onsite'],
    schedule: {
      deltaMin: 30,
      step: 15,
      asap: true,
      openingHours: {
        '0': [],
        '1': [{ start: '11:30', end: '14:30' }, { start: '18:30', end: '22:00' }],
        '2': [{ start: '11:30', end: '14:30' }, { start: '18:30', end: '22:00' }],
        '3': [{ start: '11:30', end: '14:30' }, { start: '18:30', end: '22:00' }],
        '4': [{ start: '11:30', end: '14:30' }, { start: '18:30', end: '22:00' }],
        '5': [{ start: '11:30', end: '14:30' }, { start: '18:30', end: '23:00' }],
        '6': [{ start: '12:00', end: '15:00' }, { start: '18:30', end: '23:00' }],
      },
    },
  },
  {
    id: '2',
    name: 'Pizza Express',
    address: '45 Rue de Rivoli, Paris',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500',
    cuisine: 'Italienne',
    rating: 4.2,
    deliveryTime: 35,
    optionsAvailable: ['delivery', 'pickup'],
    schedule: {
      deltaMin: 45,
      step: 30,
      asap: false,
      openingHours: {
        '0': [{ start: '18:00', end: '23:00' }],
        '1': [{ start: '18:00', end: '23:00' }],
        '2': [{ start: '18:00', end: '23:00' }],
        '3': [{ start: '18:00', end: '23:00' }],
        '4': [{ start: '18:00', end: '23:00' }],
        '5': [{ start: '18:00', end: '23:30' }],
        '6': [{ start: '18:00', end: '23:30' }],
      },
    },
  },
  {
    id: '3',
    name: 'Sushi Master',
    address: '78 Boulevard Saint-Germain, Paris',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
    cuisine: 'Japonaise',
    rating: 4.7,
    deliveryTime: 40,
    optionsAvailable: ['delivery', 'pickup', 'onsite'],
    schedule: {
      deltaMin: 60,
      step: 15,
      asap: true,
      openingHours: {
        '0': [{ start: '12:00', end: '14:30' }, { start: '19:00', end: '22:30' }],
        '1': [],
        '2': [{ start: '12:00', end: '14:30' }, { start: '19:00', end: '22:30' }],
        '3': [{ start: '12:00', end: '14:30' }, { start: '19:00', end: '22:30' }],
        '4': [{ start: '12:00', end: '14:30' }, { start: '19:00', end: '22:30' }],
        '5': [{ start: '12:00', end: '14:30' }, { start: '19:00', end: '23:00' }],
        '6': [{ start: '12:00', end: '15:00' }, { start: '19:00', end: '23:00' }],
      },
    },
  },
  {
    id: '4',
    name: 'Le Bistrot Français',
    address: '22 Rue du Faubourg Saint-Honoré, Paris',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500',
    cuisine: 'Française',
    rating: 4.8,
    deliveryTime: 45,
    optionsAvailable: ['onsite'],
    schedule: {
      deltaMin: 30,
      step: 15,
      asap: false,
      openingHours: {
        '0': [],
        '1': [{ start: '12:00', end: '14:30' }],
        '2': [{ start: '12:00', end: '14:30' }],
        '3': [{ start: '12:00', end: '14:30' }],
        '4': [{ start: '12:00', end: '14:30' }],
        '5': [{ start: '12:00', end: '14:30' }],
        '6': [],
      },
    },
  },
  {
    id: '5',
    name: 'Taco Fiesta',
    address: '156 Rue de Vaugirard, Paris',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
    cuisine: 'Mexicaine',
    rating: 4.0,
    deliveryTime: 30,
    optionsAvailable: ['delivery', 'pickup', 'onsite'],
    schedule: {
      deltaMin: 20,
      step: 15,
      asap: true,
      openingHours: {
        '0': [{ start: '11:00', end: '23:00' }],
        '1': [{ start: '11:00', end: '23:00' }],
        '2': [{ start: '11:00', end: '23:00' }],
        '3': [{ start: '11:00', end: '23:00' }],
        '4': [{ start: '11:00', end: '23:00' }],
        '5': [{ start: '11:00', end: '23:30' }],
        '6': [{ start: '11:00', end: '23:30' }],
      },
    },
  },
  {
    id: '6',
    name: 'Noodle House',
    address: '89 Avenue Parmentier, Paris',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
    cuisine: 'Asiatique',
    rating: 4.3,
    deliveryTime: 25,
    optionsAvailable: ['delivery', 'pickup'],
    schedule: {
      deltaMin: 45,
      step: 15,
      asap: false,
      openingHours: {
        '0': [{ start: '11:30', end: '21:30' }],
        '1': [],
        '2': [{ start: '11:30', end: '21:30' }],
        '3': [{ start: '11:30', end: '21:30' }],
        '4': [{ start: '11:30', end: '21:30' }],
        '5': [{ start: '11:30', end: '22:30' }],
        '6': [{ start: '11:30', end: '22:30' }],
      },
    },
  },
];

// Génère les créneaux horaires pour un jour et un magasin donnés.
// Les créneaux overnight (end < start, dernier range uniquement) sont suffixés "_1" pour indiquer J+1.
export const generateTimeSlots = (date, shop) => {
  if (!date || !shop?.schedule?.openingHours) return [];
  const { deltaMin, step, openingHours } = shop.schedule;
  const dayRanges = openingHours[String(getDay(date))] || [];
  if (dayRanges.length === 0) return [];

  const isToday = isSameDay(date, new Date());
  let minTotalMin = 0;
  if (isToday) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + deltaMin;
    minTotalMin = Math.ceil(nowMin / step) * step;
  }

  const slots = [];
  for (const range of dayRanges) {
    const [startH, startM] = range.start.split(':').map(Number);
    const [endH, endM] = range.end.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    const isOvernight = endTotal < startTotal;

    let current = startTotal;
    if (isToday && minTotalMin > startTotal) {
      const diff = minTotalMin - startTotal;
      current = startTotal + Math.ceil(diff / step) * step;
    }

    if (isOvernight) {
      // Partie même jour : startTotal → minuit
      while (current < 24 * 60) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        current += step;
      }
      // Partie J+1 : minuit → endTotal (pas de filtre isToday, ces créneaux sont toujours dans le futur)
      current = current % (24 * 60);
      while (current < endTotal) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}_1`);
        current += step;
      }
    } else {
      while (current < endTotal) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        if (h < 24) {
          slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
        current += step;
      }
    }
  }
  return slots;
};

// Vérifie que le créneau date+heure choisi n'est pas dans le passé.
// nextDay=true décale la date d'un jour (créneau overnight J+1).
const isDeliveryTimeValid = (deliveryDate, deliveryHour, nextDay = false) => {
  if (!deliveryDate || !deliveryHour) return false;
  try {
    let date = deliveryDate instanceof Date ? new Date(deliveryDate) : parseISO(deliveryDate);
    if (nextDay) date = addDays(date, 1);
    const [h, m] = deliveryHour.split(':').map(Number);
    date.setHours(h, m, 0, 0);
    return !isBefore(date, new Date());
  } catch {
    return false;
  }
};

const loadStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const ShopShippingContext = createContext({
  shopsList: [],
  shopsLoading: true,
  shopsSearchLoading: false,
  isSingleShop: false,
  shop: null,
  setShop: () => {},
  deliveryMethod: 'delivery',
  setDeliveryMethod: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {},
  deliveryHour: null,
  setDeliveryHour: () => {},
  nextDay: false,
  setNextDay: () => {},
  asap: false,
  setAsap: () => {},
  timeSlots: [],
  isSelectionValid: false,
  validateAndResetIfNeeded: () => {},
  searchShopsByCity: () => {},
});

export const ShopShippingProvider = ({ children }) => {
  const [shopsList, setShopsList] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsSearchLoading, setShopsSearchLoading] = useState(false);
  const [isSingleShop, setIsSingleShop] = useState(false);
  const [shop, setShopState] = useState(null);
  const [deliveryMethod, setDeliveryMethodState] = useState('delivery');
  const [deliveryDate, setDeliveryDateState] = useState(null);
  const [deliveryHour, setDeliveryHourState] = useState(null);
  const [nextDay, setNextDayState] = useState(false);
  const [asap, setAsapState] = useState(false);

  const timeSlots = useMemo(
    () => generateTimeSlots(deliveryDate, shop),
    [deliveryDate, shop]
  );

  const isSelectionValid = useMemo(() => {
    if (!shop) return false;
    const available = shop.optionsAvailable || [];
    if (available.length === 0) return false;
    if (!available.includes(deliveryMethod)) return false;
    if (asap) return true;
    return !!(deliveryDate && deliveryHour);
  }, [shop, deliveryMethod, asap, deliveryDate, deliveryHour]);

  const validateAndResetIfNeeded = useCallback(() => {
    if (asap) return;
    if (deliveryDate && deliveryHour && !isDeliveryTimeValid(deliveryDate, deliveryHour, nextDay)) {
      setDeliveryDateState(null);
      setDeliveryHourState(null);
      setNextDayState(false);
      setAsapState(false);
      const stored = loadStorage();
      saveStorage({ ...stored, deliveryDate: null, deliveryHour: null, nextDay: false, asap: false });
    }
  }, [deliveryDate, deliveryHour, nextDay, asap]);

  useEffect(() => {
    const loadShops = async () => {
      console.log('on fait loadShops');
      setShopsLoading(true);
      let list = [];
      try {
        const fetched = await services.shopService.getShopsList();
        list = fetched?.length > 0 ? fetched : MOCK_SHOPS;
      console.log('on fait loadShops 1');
      } catch {
        list = MOCK_SHOPS;
      console.log('on fait loadShops 2');
      } finally {
        setShopsList(list);
      console.log('on fait loadShops 3');

        const stored = loadStorage();

        // Auto-sélection et isSingleShop uniquement sur le chargement initial
        if (list.length === 1) {
          setIsSingleShop(true);
          setShopState(list[0]);
        } else if (stored.shopId) {
          const found = list.find((s) => String(s.id) === String(stored.shopId));
          if (found) setShopState(found);
        }

        if (stored.deliveryMethod) setDeliveryMethodState(stored.deliveryMethod);
        if (stored.asap) setAsapState(stored.asap);

        // Restaurer la date/heure uniquement si elle est encore valide
        if (stored.deliveryDate && stored.deliveryHour) {
          if (isDeliveryTimeValid(stored.deliveryDate, stored.deliveryHour, stored.nextDay ?? false)) {
            setDeliveryDateState(parseISO(stored.deliveryDate));
            setDeliveryHourState(stored.deliveryHour);
            if (stored.nextDay) setNextDayState(true);
          } else {
            saveStorage({ ...stored, deliveryDate: null, deliveryHour: null, nextDay: false, asap: false });
          }
        }

      console.log('on fait loadShops 4');
        setShopsLoading(false);
      }
    };

    // loadShops().catch(() => setShopsLoading(false));
    loadShops();
  }, []);

  const setShop = useCallback((newShop) => {
    setShopState(newShop);
    const firstMethod = newShop?.optionsAvailable?.[0] ?? null;
    setDeliveryMethodState(firstMethod);
    setDeliveryDateState(null);
    setDeliveryHourState(null);
    setNextDayState(false);
    setAsapState(false);
    saveStorage({ ...loadStorage(), shopId: newShop?.id, deliveryMethod: firstMethod, deliveryDate: null, deliveryHour: null, nextDay: false, asap: false });
  }, []);

  const setDeliveryMethod = useCallback((method) => {
    setDeliveryMethodState(method);
    setDeliveryDateState(null);
    setDeliveryHourState(null);
    setNextDayState(false);
    setAsapState(false);
    saveStorage({ ...loadStorage(), deliveryMethod: method, deliveryDate: null, deliveryHour: null, nextDay: false, asap: false });
  }, []);

  const setDeliveryDate = useCallback((date) => {
    setDeliveryDateState(date);
    setDeliveryHourState(null);
    setNextDayState(false);
    setAsapState(false);
    const dateStr = date ? format(date, 'yyyy-MM-dd') : null;
    saveStorage({ ...loadStorage(), deliveryDate: dateStr, deliveryHour: null, nextDay: false, asap: false });
  }, []);

  const setDeliveryHour = useCallback((hour) => {
    setDeliveryHourState(hour);
    saveStorage({ ...loadStorage(), deliveryHour: hour });
  }, []);

  const setNextDay = useCallback((value) => {
    setNextDayState(value);
    saveStorage({ ...loadStorage(), nextDay: value });
  }, []);

  const setAsap = useCallback((value) => {
    setAsapState(value);
    if (value) {
      setDeliveryDateState(null);
      setDeliveryHourState(null);
      setNextDayState(false);
    }
    saveStorage({
      ...loadStorage(),
      asap: value,
      ...(value ? { deliveryDate: null, deliveryHour: null, nextDay: false } : {}),
    });
  }, []);

  const searchShopsByCity = useCallback(async (city) => {
    setShopsSearchLoading(true);
    try {
      const fetched = await services.shopService.getShopsList(city || undefined);
      setShopsList(fetched?.length > 0 ? fetched : []);
    } catch {
      setShopsList([]);
    } finally {
      setShopsSearchLoading(false);
    }
  }, []);

  const value = {
    shopsList,
    shopsLoading,
    shopsSearchLoading,
    isSingleShop,
    shop,
    setShop,
    deliveryMethod,
    setDeliveryMethod,
    deliveryDate,
    setDeliveryDate,
    deliveryHour,
    setDeliveryHour,
    nextDay,
    setNextDay,
    asap,
    setAsap,
    timeSlots,
    isSelectionValid,
    validateAndResetIfNeeded,
    searchShopsByCity,
  };

  return (
    <ShopShippingContext.Provider value={value}>
      {children}
    </ShopShippingContext.Provider>
  );
};
