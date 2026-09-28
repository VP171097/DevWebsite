import React, { createContext, useContext, useEffect, useState } from "react";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const getAssetUrl = (path) => {
  if (typeof path !== "string") return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  )
    return path;
  if (
    path.startsWith("/assets/") ||
    path.startsWith("assets/") ||
    path.startsWith("/resume") ||
    path.startsWith("resume") ||
    /^\/?Vivek_Pandey_/.test(path)
  ) {
    const base = import.meta.env.BASE_URL.replace(/^\.\//, "/");
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  }
  return path;
};

const processConfig = (obj) => {
  if (!obj) return obj;
  if (typeof obj === "string") return getAssetUrl(obj);
  if (Array.isArray(obj)) return obj.map(processConfig);
  if (typeof obj === "object") {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = processConfig(obj[key]);
    }
    return res;
  }
  return obj;
};

const fetchConfig = async (filename) => {
  const url = `${import.meta.env.BASE_URL}config/${filename}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${filename}`);
  const json = await res.json();
  return processConfig(json);
};

const configFiles = [
  "about.json",
  "skills.json",
  "experience.json",
  "education.json",
  "landing.json",
  "sidebar.json",
  "navigation.json",
  "socialLinks.json",
  "projects.json",
  "certifications.json",
  "achievements.json",
  "testimonials.json",
  "cheatsheets.json",
];

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const results = {};
        for (const file of configFiles) {
          const key = file.replace(".json", "");
          results[key] = await fetchConfig(file);
        }
        setConfig(results);
        setLoading(false);
      } catch (err) {
        console.error("Error loading config:", err);
      }
    };
    loadAll();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
