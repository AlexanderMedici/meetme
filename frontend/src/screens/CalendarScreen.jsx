import { useMemo, useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaLink,
  FaClock,
} from "react-icons/fa";
import {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from "../slices/appointmentApiSlice";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Dialog, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../components/ui/dropdown";

const formatDateKey = (date) => date.toISOString().split("T")[0];
const SLOT_HEIGHT = 48; // px per hour

const startOfMonthGrid = (current) => {
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const offset = first.getDay();
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return start;
};

const endOfMonthGrid = (current) => {
  const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  const offset = 6 - last.getDay();
  const end = new Date(last);
  end.setDate(last.getDate() + offset);
  return end;
};

const CalendarScreen = () => {
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [selectingRange, setSelectingRange] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("event");
  const [editingId, setEditingId] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    meetingLink: "",
    notes: "",
    color: "#0b57d0",
  });

  const gridStart = useMemo(() => startOfMonthGrid(monthCursor), [monthCursor]);
  const gridEnd = useMemo(() => endOfMonthGrid(monthCursor), [monthCursor]);

  const { data: appointments = [] } = useGetAppointmentsQuery({
    from: gridStart.toISOString(),
    to: gridEnd.toISOString(),
  });

  const [createAppointment, { isLoading: creating }] =
    useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: updating }] =
    useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const days = useMemo(() => {
    const arr = [];
    const cursor = new Date(gridStart);
    while (cursor <= gridEnd) {
      arr.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return arr;
  }, [gridStart, gridEnd]);

  const resetForm = (overrides = {}) => {
    setAppointmentForm({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      meetingLink: "",
      notes: "",
      color: "#0b57d0",
      ...overrides,
    });
    setEditingId(null);
  };

  const openModal = (payload = {}) => {
    if (payload.id) setEditingId(payload.id);
    else setEditingId(null);
    if (payload.date) setSelectedDate(payload.date);
    resetForm({
      ...payload,
      startTime: payload.startTime || "09:00",
      endTime: payload.endTime || "10:00",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(`${selectedDate}T${appointmentForm.startTime}`);
    const end = new Date(`${selectedDate}T${appointmentForm.endTime}`);
    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }
    const payload = {
      title: appointmentForm.title || "Untitled",
      start,
      end,
      meetingLink: appointmentForm.meetingLink,
      notes: appointmentForm.notes,
      color: appointmentForm.color,
    };
    try {
      if (editingId) {
        await updateAppointment({ id: editingId, ...payload }).unwrap();
        toast.success("Appointment updated");
      } else {
        await createAppointment(payload).unwrap();
        toast.success("Appointment created");
      }
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Save failed");
    }
  };

  const handleEditAppointment = (appt) => {
    const start = new Date(appt.start);
    const end = new Date(appt.end);
    openModal({
      id: appt._id,
      date: formatDateKey(start),
      startTime: start.toISOString().slice(11, 16),
      endTime: end.toISOString().slice(11, 16),
      title: appt.title || "",
      meetingLink: appt.meetingLink || "",
      notes: appt.notes || "",
      color: appt.color || "#0b57d0",
    });
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteAppointment(id).unwrap();
      toast.info("Appointment removed");
      if (editingId === id) setEditingId(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Delete failed");
    }
  };

  const finalizeSelection = (colIdx, startRow, endRow) => {
    if (colIdx === null || startRow === null || endRow === null) return;
    const startR = Math.min(startRow, endRow);
    const endR = Math.max(startRow, endRow) + 1;
    const date = days[colIdx];
    const startHour = 1 + startR;
    const endHour = 1 + endR;
    const dateKey = formatDateKey(date);
    setSelectedDate(dateKey);
    openModal({
      date: dateKey,
      startTime: `${String(startHour).padStart(2, "0")}:00`,
      endTime: `${String(endHour).padStart(2, "0")}:00`,
    });
  };

  const positionForAppt = (appt) => {
    const start = new Date(appt.start);
    const end = new Date(appt.end);
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const durationMinutes = Math.max(15, (end - start) / 60000);
    const top =
      Math.max(0, (startHours - 1) * 60 + startMinutes) * (SLOT_HEIGHT / 60);
    const height = (durationMinutes / 60) * SLOT_HEIGHT;
    return { top, height };
  };

  const miniMonth = useMemo(() => {
    const start = startOfMonthGrid(monthCursor);
    const end = endOfMonthGrid(monthCursor);
    const arr = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      arr.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return arr;
  }, [monthCursor]);

  const themeClass = "cal-dark";
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleMiniSelect = (dateKey) => {
    setSelectedDate(dateKey);
    setMonthCursor(new Date(dateKey));
    openModal({ date: dateKey });
  };

  useEffect(() => {
    const navHandler = (e) => {
      const { delta, type } = e.detail || {};
      if (type === "today") {
        const today = new Date();
        setMonthCursor(today);
        setSelectedDate(formatDateKey(today));
        return;
      }
      if (typeof delta === "number") {
        const next = new Date(
          monthCursor.getFullYear(),
          monthCursor.getMonth() + delta,
          1
        );
        setMonthCursor(next);
        setSelectedDate(formatDateKey(next));
      }
    };
    window.addEventListener("calendar-nav", navHandler);
    return () => window.removeEventListener("calendar-nav", navHandler);
  }, [monthCursor]);

  useEffect(() => {
    const next = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      1
    );
    const label = `${monthCursor.toLocaleString("default", {
      month: "short",
    })} - ${next.toLocaleString("default", {
      month: "short",
    })} ${monthCursor.getFullYear()}`;
    window.dispatchEvent(
      new CustomEvent("calendar-month-label", { detail: label })
    );
  }, [monthCursor]);

  return (
    <div className={`calendar-shell ${themeClass}`}>
      <div className="calendar-side">
        <div className="side-top">
          <Dropdown>
            <DropdownTrigger className="create-btn w-200">+</DropdownTrigger>
            <DropdownContent align="start" width={200}>
              <DropdownItem
                type="button"
                onClick={() => {
                  const today = formatDateKey(new Date());
                  setSelectedDate(today);
                  openModal({ date: today });
                }}
              >
                Appointment
              </DropdownItem>
              <DropdownItem
                type="button"
                onClick={() => {
                  const today = formatDateKey(new Date());
                  setSelectedDate(today);
                  openModal({ date: today });
                }}
              >
                Event
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>

        <div className="mini-cal">
          <div className="mini-head">
            <span className="mini-month">
              {monthCursor.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="mini-nav">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setMonthCursor(
                    new Date(
                      monthCursor.getFullYear(),
                      monthCursor.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                <FaChevronLeft />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setMonthCursor(
                    new Date(
                      monthCursor.getFullYear(),
                      monthCursor.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                <FaChevronRight />
              </Button>
            </div>
          </div>
          <div className="mini-grid">
            {weekdayLabels.map((d) => (
              <div key={d} className="mini-label">
                {d[0]}
              </div>
            ))}
            {miniMonth.map((day) => {
              const key = formatDateKey(day);
              const inMonth = day.getMonth() === monthCursor.getMonth();
              const isSelected = key === selectedDate;
              const isToday = key === formatDateKey(new Date());
              return (
                <button
                  type="button"
                  key={key}
                  className={`mini-cell ${inMonth ? "" : "muted"} ${
                    isSelected ? "mini-selected" : ""
                  } ${isToday ? "mini-today" : ""}`}
                  onClick={() => handleMiniSelect(key)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="calendar-main">
        <div className="week-header">
          {days.slice(0, 7).map((day, idx) => (
            <div key={idx} className="week-header__cell">
              <div className="week-header__dow">
                {day
                  .toLocaleDateString(undefined, { weekday: "short" })
                  .toUpperCase()}
              </div>
              <div className="week-header__date">{day.getDate()}</div>
            </div>
          ))}
        </div>

        <div className="grid-wrap">
          <div
            className="time-grid"
            onMouseUp={() => {
              if (selectingRange && rangeStart && rangeEnd) {
                finalizeSelection(rangeStart.col, rangeStart.row, rangeEnd.row);
              }
              setSelectingRange(false);
              setRangeStart(null);
              setRangeEnd(null);
            }}
          >
            {days.slice(0, 7).map((day, colIdx) => (
              <div key={colIdx} className="time-column">
                {Array.from({ length: 23 }).map((_, rowIdx) => {
                  const hour = 1 + rowIdx;
                  const isSelected =
                    selectingRange &&
                    rangeStart &&
                    rangeEnd &&
                    rangeStart.col === colIdx &&
                    Math.min(rangeStart.row, rangeEnd.row) <= rowIdx &&
                    Math.max(rangeStart.row, rangeEnd.row) >= rowIdx;
                  return (
                    <div
                      key={rowIdx}
                      className={`time-slot ${
                        isSelected ? "slot-selected" : ""
                      }`}
                      onMouseDown={() => {
                        setRangeStart({ col: colIdx, row: rowIdx });
                        setRangeEnd({ col: colIdx, row: rowIdx });
                        setSelectingRange(true);
                      }}
                      onMouseEnter={() => {
                        if (selectingRange && rangeStart?.col === colIdx) {
                          setRangeEnd({ col: colIdx, row: rowIdx });
                        }
                      }}
                    >
                      {colIdx === 0 && (
                        <span className="time-label">
                          {hour > 12 ? hour - 12 : hour}:00{" "}
                          {hour >= 12 ? "PM" : "AM"}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="appt-layer">
                  {appointments
                    .filter(
                      (appt) =>
                        formatDateKey(new Date(appt.start)) ===
                        formatDateKey(day)
                    )
                    .map((appt) => {
                      const pos = positionForAppt(appt);
                      return (
                        <div
                          key={appt._id}
                          className="appt-block"
                          style={{
                            backgroundColor: appt.color || "#0b57d0",
                            top: pos.top,
                            height: pos.height,
                          }}
                          onClick={() => handleEditAppointment(appt)}
                        >
                          <div className="appt-title">{appt.title}</div>
                          <div className="appt-time">
                            {new Date(appt.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(appt.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="appt-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appt._id);
                            }}
                          >
                            x
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
        <div className="cal-modal__card">
          <DialogHeader className="cal-modal__header">
            <DialogTitle className="cal-modal__title">
              {editingId ? "Edit appointment" : "Add title"}
            </DialogTitle>
            <Button
              size="sm"
              variant="ghost"
              className="cal-modal__close"
              type="button"
              onClick={() => setShowModal(false)}
            >
              x
            </Button>
          </DialogHeader>
          <div className="cal-modal__tabs">
            <Button
              size="sm"
              className={activeTab === "event" ? "tab-active" : ""}
              variant={activeTab === "event" ? "default" : "outline"}
              type="button"
              onClick={() => setActiveTab("event")}
            >
              Event
            </Button>
            <Button
              size="sm"
              className={activeTab === "task" ? "tab-active" : ""}
              variant={activeTab === "task" ? "default" : "outline"}
              type="button"
              onClick={() => setActiveTab("task")}
            >
              Task
            </Button>
            <Button
              size="sm"
              className={activeTab === "appointment" ? "tab-active" : ""}
              variant={activeTab === "appointment" ? "default" : "outline"}
              type="button"
              onClick={() => setActiveTab("appointment")}
            >
              Schedule Appointment <span className="ui-badge"> +</span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="cal-modal__form">
            <div className="mb-3">
              <Input
                value={appointmentForm.title}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    title: e.target.value,
                  })
                }
                placeholder="Add title"
                className="cal-modal__input cal-modal__input-lg"
                required
              />
            </div>
            <div className="cal-modal__row">
              <div className="flex-grow-1">
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaClock />
                  {new Date(selectedDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="d-flex gap-2 align-items-center mt-2">
                  <Input
                    type="time"
                    value={appointmentForm.startTime}
                    onChange={(e) =>
                      setAppointmentForm({
                        ...appointmentForm,
                        startTime: e.target.value,
                      })
                    }
                    className="cal-modal__input"
                    required
                  />
                  <span className="text-muted small">-</span>
                  <Input
                    type="time"
                    value={appointmentForm.endTime}
                    onChange={(e) =>
                      setAppointmentForm({
                        ...appointmentForm,
                        endTime: e.target.value,
                      })
                    }
                    className="cal-modal__input"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="cal-modal__row">
              <div className="flex-grow-1">
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaLink /> Add Google Meet video conferencing
                </div>
                <Input
                  value={appointmentForm.meetingLink}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      meetingLink: e.target.value,
                    })
                  }
                  placeholder="Add Google Meet or URL"
                  className="cal-modal__input mt-2"
                />
              </div>
            </div>
            <div className="cal-modal__row">
              <div className="flex-grow-1">
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaMapMarkerAlt /> Add location
                </div>
                <Textarea
                  value={appointmentForm.notes}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add description or a Google Drive attachment"
                  className="cal-modal__input mt-2"
                  rows={3}
                />
              </div>
            </div>
            <div className="cal-modal__row">
              <div className="flex-grow-1">
                <div className="text-muted small">Color</div>
                <input
                  type="color"
                  value={appointmentForm.color}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      color: e.target.value,
                    })
                  }
                  className="cal-modal__color mt-1"
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button variant="ghost" type="button">
                More options
              </Button>
              <div className="d-flex gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating || updating}>
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default CalendarScreen;
