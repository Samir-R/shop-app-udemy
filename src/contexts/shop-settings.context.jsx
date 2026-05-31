import { createContext, useEffect, useState } from 'react';
import services from '../services';

export const ShopSettingsContext = createContext({
  id: null,
  name: null,
  displayNameOnHeader: null,
  websiteUrl: null,
  logo: null,
  primaryColor: null,
});

export const ShopSettingsProvider = ({ children }) => {
  const [shopSettings, setShopSettings] = useState({
    id: null,
    name: null,
    displayNameOnHeader: null,
    websiteUrl: null,
    logo: null,
    primaryColor: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchShopSettings = async () => {
      const data = await services.shopSettingsService.getShopSettings();
      const { id, name, displayNameOnHeader, websiteUrl, logo, primaryColor } = data;
      setShopSettings({ id, name, displayNameOnHeader, websiteUrl, logo, primaryColor });
      setIsLoaded(true);
    };
    fetchShopSettings();
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #333',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <ShopSettingsContext.Provider value={shopSettings}>
      {children}
    </ShopSettingsContext.Provider>
  );
};
