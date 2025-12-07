import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../slices/appointmentApiSlice";
import { Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const EventFormScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const dateParam = searchParams.get("date");
  const startParam = searchParams.get("startTime");
  const endParam = searchParams.get("endTime");
  const titleParam = searchParams.get("title") || "";
  const linkParam = searchParams.get("meetingLink") || "";
  const notesParam = searchParams.get("notes") || "";
  const colorParam = searchParams.get("color") || "#0b57d0";

  const defaultDate = useMemo(() => {
    const d = dateParam ? new Date(dateParam) : new Date();
    return d.toISOString().split("T")[0];
  }, [dateParam]);

  const [appointmentForm, setAppointmentForm] = useState({
    title: titleParam,
    startTime: startParam || "09:00",
    endTime: endParam || "10:00",
    meetingLink: linkParam,
    notes: notesParam,
    color: colorParam,
  });
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("event");
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: updating }] =
    useUpdateAppointmentMutation();

  useEffect(() => {
    setSelectedDate(defaultDate);
    setAppointmentForm((f) => ({
      ...f,
      title: titleParam,
      startTime: startParam || "09:00",
      endTime: endParam || "10:00",
      meetingLink: linkParam,
      notes: notesParam,
      color: colorParam,
    }));
  }, [defaultDate, titleParam, startParam, endParam, linkParam, notesParam, colorParam]);

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
      if (idParam) {
        await updateAppointment({ id: idParam, ...payload }).unwrap();
        toast.success("Appointment updated");
      } else {
        await createAppointment(payload).unwrap();
        toast.success("Appointment created");
      }
      setIsDialogOpen(false);
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Save failed");
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    navigate("/");
  };

  const handleDialogChange = (nextOpen) => {
    if (!nextOpen) closeDialog();
  };

  const friendlyDate = useMemo(() => {
    try {
      return new Date(selectedDate).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="event-modal-shell">
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <form onSubmit={handleSubmit} className="event-form-card">
          <DialogHeader>
            <div>
              <DialogTitle>{idParam ? "Edit event" : "Create a new event"}</DialogTitle>
              <DialogDescription>
                Drop the essentials and we will slot it into your calendar.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              aria-label="Close"
              onClick={closeDialog}
            >
              Close
            </Button>
          </DialogHeader>

          <div className="ui-pill-group">
            <Button
              variant={activeTab === "event" ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={() => setActiveTab("event")}
            >
              Event
            </Button>
            <Button
              variant={activeTab === "task" ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={() => setActiveTab("task")}
            >
              Task
            </Button>
            <Button
              variant={activeTab === "schedule" ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={() => setActiveTab("schedule")}
            >
              Appointment schedule <span className="ui-badge">New</span>
            </Button>
          </div>

          <DialogBody>
            <div className="ui-pane">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={appointmentForm.title}
                onChange={(e) =>
                  setAppointmentForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Add title"
                required
              />
            </div>

            <div className="ui-pane">
              <div className="event-row">
                <div className="event-inline-hint">
                  <span className="ui-kbd">When</span>
                  <span className="ui-muted">{friendlyDate}</span>
                </div>
              </div>
              <div className="event-meta">
                <div className="ui-field">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="ui-field">
                  <Label htmlFor="start">Start</Label>
                  <Input
                    id="start"
                    type="time"
                    value={appointmentForm.startTime}
                    onChange={(e) =>
                      setAppointmentForm((f) => ({
                        ...f,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="ui-field">
                  <Label htmlFor="end">End</Label>
                  <Input
                    id="end"
                    type="time"
                    value={appointmentForm.endTime}
                    onChange={(e) =>
                      setAppointmentForm((f) => ({
                        ...f,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="ui-pane">
              <div className="event-inline-hint">
                <span className="ui-kbd">Link</span>
                <span className="ui-muted">Add Google Meet or a URL</span>
              </div>
              <Input
                id="meeting-link"
                value={appointmentForm.meetingLink}
                onChange={(e) =>
                  setAppointmentForm((f) => ({
                    ...f,
                    meetingLink: e.target.value,
                  }))
                }
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="ui-pane">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={appointmentForm.notes}
                onChange={(e) =>
                  setAppointmentForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Add context, files, or prep notes"
              />
            </div>

            <div className="ui-pane event-color">
              <div className="event-inline-hint">
                <span className="ui-kbd">Color</span>
                <span className="ui-muted">Show it on the grid</span>
              </div>
              <input
                type="color"
                value={appointmentForm.color}
                onChange={(e) =>
                  setAppointmentForm((f) => ({ ...f, color: e.target.value }))
                }
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" size="sm" type="button">
              More options
            </Button>
            <div className="event-row">
              <Button variant="ghost" type="button" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || updating}>
                {idParam ? "Update event" : "Save event"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default EventFormScreen;
