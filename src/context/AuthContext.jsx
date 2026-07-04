import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [admin] = useState({ name: 'Ravi Menon', email: 'ravi.menon@nimbus.app', initials: 'RM' });

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        admin,
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
