import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { daysUntilEvent } from "../utils/countdown";
import EventForm from "../components/EventForm";
import type { UserEvent } from "../types";

function HomePage() {
  const { t } = useTranslation();
  const { events, tags, deleteEvent } = useApp();
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sortedEvents = useMemo(() => {
    let filtered = events;
    if (filterTag) {
      filtered = events.filter((e) => e.tags.includes(filterTag));
    }
    return filtered
      .map((e) => ({ event: e, days: daysUntilEvent(e) }))
      .filter((e) => e.days !== Infinity)
      .sort((a, b) => a.days - b.days);
  }, [events, filterTag]);

  function handleEdit(event: UserEvent) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteEvent(id);
    setConfirmDeleteId(null);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingEvent(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("home.title")}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + {t("home.addEvent")}
        </button>
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterTag(null)}
            className={`px-3 py-1 text-xs rounded-full border ${
              !filterTag
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
            }`}
          >
            {t("home.allTags")}
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`px-3 py-1 text-xs rounded-full border ${
                filterTag === tag.id
                  ? "text-white border-transparent"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
              }`}
              style={filterTag === tag.id ? { backgroundColor: tag.color } : undefined}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Events list */}
      {sortedEvents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-12">{t("home.noEvents")}</p>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map(({ event, days }) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{event.name}</h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {event.tags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tagId}
                        className="px-2 py-0.5 text-xs rounded-full text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                {event.comment && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{event.comment}</p>
                )}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  {days === 0 ? (
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {t("home.today")}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {t("home.daysLeft", { count: days })}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"
                    title={t("home.editEvent")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {confirmDeleteId === event.id ? (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded"
                      title={t("home.confirmDelete")}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13h14v-2H5v2z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(event.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      title={t("home.deleteEvent")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event form modal */}
      {showForm && <EventForm event={editingEvent} onClose={handleFormClose} />}
    </div>
  );
}

export default HomePage;
