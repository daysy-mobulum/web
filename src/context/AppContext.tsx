import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { AppData, AppSettings, UserEvent, Tag } from "../types";
import { loadData, saveData, clearAllData as clearStorage } from "../utils/storage";

interface AppContextValue {
  data: AppData;
  settings: AppSettings;
  events: UserEvent[];
  tags: Tag[];
  updateSettings: (settings: Partial<AppSettings>) => void;
  setEvents: (events: UserEvent[]) => void;
  addEvent: (event: UserEvent) => void;
  updateEvent: (event: UserEvent) => void;
  deleteEvent: (id: string) => void;
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  importAppData: (data: AppData) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  }, []);

  const setEvents = useCallback((events: UserEvent[]) => {
    setData((prev) => ({ ...prev, events }));
  }, []);

  const addEvent = useCallback((event: UserEvent) => {
    setData((prev) => ({ ...prev, events: [...prev.events, event] }));
  }, []);

  const updateEvent = useCallback((event: UserEvent) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === event.id ? event : e)),
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  }, []);

  const setTags = useCallback((tags: Tag[]) => {
    setData((prev) => ({ ...prev, tags }));
  }, []);

  const addTag = useCallback((tag: Tag) => {
    setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  }, []);

  const deleteTag = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== id),
      events: prev.events.map((e) => ({
        ...e,
        tags: e.tags.filter((t) => t !== id),
      })),
    }));
  }, []);

  const importAppData = useCallback((newData: AppData) => {
    setData(newData);
  }, []);

  const clearAll = useCallback(() => {
    clearStorage();
    setData(loadData());
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        settings: data.settings,
        events: data.events,
        tags: data.tags,
        updateSettings,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        setTags,
        addTag,
        deleteTag,
        importAppData,
        clearAllData: clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
