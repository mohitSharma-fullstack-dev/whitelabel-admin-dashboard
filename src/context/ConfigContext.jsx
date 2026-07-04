import React, { createContext, useContext, useState } from 'react';

// This mirrors the shape of brand.json in the mobile app. In production,
// saving here would PUT /config/branding on the Node API, and the mobile
// app would fetch it on launch (or receive it via the webhook events below).
const defaultConfig = {
  appName: 'Nimbus',
  tagline: 'Stay close, wherever you are.',
  logoInitial: 'N',
  colors: {
    primary: '#1F6F6B',
    accent: '#FF7A59',
    success: '#34A876',
  },
  features: {
    endToEndEncryption: true,
    fileSharing: true,
    readReceipts: true,
    typingIndicators: true,
    maxFileUploadMb: 25,
  },
};

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const [savedAt, setSavedAt] = useState(null);

  const updateConfig = (partial) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const updateColors = (partial) => {
    setConfig((prev) => ({ ...prev, colors: { ...prev.colors, ...partial } }));
  };

  const updateFeatures = (partial) => {
    setConfig((prev) => ({ ...prev, features: { ...prev.features, ...partial } }));
  };

  const save = () => setSavedAt(new Date());

  return (
    <ConfigContext.Provider
      value={{ config, updateConfig, updateColors, updateFeatures, save, savedAt }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
