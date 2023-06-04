import { createContext, useState } from 'react';

export const ThemeCustomContext = createContext({
  headerHeight: null,
  setHeaderHeight: () => {},
});

export const ThemeCustomProvider = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(null);


  const value = { headerHeight, setHeaderHeight };
  return (
    <ThemeCustomContext.Provider value={value}>
      {children}
    </ThemeCustomContext.Provider>
  );
};
