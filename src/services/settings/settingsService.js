const STORAGE_KEY = "glt_healthcare_settings";

const DEFAULT_SETTINGS = {
  clinicName: "GLT Healthcare",
  logo: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const settingsService = {
  getSettings: async () => {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  },
  updateSettings: async (payload) => {
    await delay();
    const merged = { ...DEFAULT_SETTINGS, ...payload };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  },
};

export default settingsService;
