import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { v4 as uuid } from "uuid";
import type { UserEvent, RecurrenceType, Tag } from "../types";

interface EventFormProps {
  event: UserEvent | null;
  onClose: () => void;
}

const TAG_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

function EventForm({ event, onClose }: EventFormProps) {
  const { t } = useTranslation();
  const { addEvent, updateEvent, tags, addTag } = useApp();

  const [name, setName] = useState(event?.name || "");
  const [date, setDate] = useState(event?.date || "");
  const [time, setTime] = useState(event?.time || "");
  const [recurrence, setRecurrence] = useState<RecurrenceType>(event?.recurrence || "none");
  const [comment, setComment] = useState(event?.comment || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(event?.tags || []);
  const [newTagName, setNewTagName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !date) return;

    const eventData: UserEvent = {
      id: event?.id || uuid(),
      name: name.trim(),
      date,
      time: time || undefined,
      recurrence,
      comment: comment.trim() || undefined,
      tags: selectedTags,
    };

    if (event) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  }

  function handleCreateTag() {
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: uuid(),
      name: newTagName.trim(),
      color: TAG_COLORS[tags.length % TAG_COLORS.length],
    };
    addTag(newTag);
    setSelectedTags([...selectedTags, newTag.id]);
    setNewTagName("");
    setShowNewTag(false);
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {event ? t("home.editEvent") : t("home.addEvent")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("event.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("event.date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("event.time")}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("event.recurrence")}</label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="none">{t("event.recurrenceOptions.none")}</option>
              <option value="weekly">{t("event.recurrenceOptions.weekly")}</option>
              <option value="monthly">{t("event.recurrenceOptions.monthly")}</option>
              <option value="yearly">{t("event.recurrenceOptions.yearly")}</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("event.comment")}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("event.tags")}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedTags.includes(tag.id)
                      ? "text-white border-transparent"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : undefined}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            {showNewTag ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={t("event.addTag")}
                  className="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateTag())}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg"
                >
                  {t("event.createTag")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewTag(true)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + {t("event.addTag")}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-gray-600"
            >
              {t("event.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {t("event.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
