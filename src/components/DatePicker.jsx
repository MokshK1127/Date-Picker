"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskViewer from "./TaskViewer"; // Ensure this component is implemented

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [task, setTask] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [endDate, setEndDate] = useState(null);
  const [customRecurrence, setCustomRecurrence] = useState({
    type: "days",
    value: 1,
  });
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const checkForReminders = useCallback(() => {
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const todayReminders = tasks.filter((t) => {
      const taskDate = new Date(t.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    setReminders(todayReminders);
  }, [tasks, currentDate]);

  useEffect(() => {
    checkForReminders();
  }, [checkForReminders]);

  const handleDateClick = useCallback(
    (day) => {
      const clickedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        day
      );
      setSelectedDate(clickedDate);
      setShowPopup(true);
    },
    [selectedDate]
  );

  const handleRecurrenceChange = (e) => {
    setRecurrence(e.target.value);
  };

  const handleCustomRecurrenceChange = (e) => {
    setCustomRecurrence({
      ...customRecurrence,
      [e.target.name]: e.target.value,
    });
  };

  const generateRecurringDates = (startDate, recurrenceType, customRecurrence, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));

      switch (recurrenceType) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "yearly":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        case "custom":
          switch (customRecurrence.type) {
            case "days":
              currentDate.setDate(currentDate.getDate() + parseInt(customRecurrence.value));
              break;
            case "weeks":
              currentDate.setDate(currentDate.getDate() + (7 * parseInt(customRecurrence.value)));
              break;
            case "months":
              currentDate.setMonth(currentDate.getMonth() + parseInt(customRecurrence.value));
              break;
            case "years":
              currentDate.setFullYear(currentDate.getFullYear() + parseInt(customRecurrence.value));
              break;
          }
          break;
        default:
          return [startDate];
      }
    }

    return dates;
  };

  const handleTaskSubmit = () => {
    if (!task || !endDate) return;

    const recurringDates = generateRecurringDates(selectedDate, recurrence, customRecurrence, endDate);

    const newTasks = recurringDates.map(date => ({
      date,
      task,
      recurrence,
      customRecurrence: recurrence === "custom" ? customRecurrence : null,
    }));

    setTasks(prevTasks => [...prevTasks, ...newTasks]);

    setTask("");
    setRecurrence("none");
    setEndDate(null);
    setShowPopup(false);
  };

  const handleCloseTask = () => {
    setTask("");
    setShowPopup(false);
  };

  const daysInMonth = useMemo(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate(),
    [selectedDate]
  );

  const renderCalendar = useCallback(() => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      );
      const isCurrentDate = date.toDateString() === currentDate.toDateString();
      const hasTask = tasks.some((task) => {
        const taskDate = new Date(task.date);
        return (
          taskDate.getFullYear() === date.getFullYear() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getDate() === date.getDate()
        );
      });

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i)}
          className={`p-2 m-1 text-center relative ${
            selectedDate.getDate() === i
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          } ${isCurrentDate ? "font-bold" : ""}`}
        >
          {i}
          {hasTask && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      );
    }
    return days;
  }, [selectedDate, currentDate, daysInMonth, handleDateClick, tasks]);

  const firstDayOfMonth = useMemo(
    () =>
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay(),
    [selectedDate]
  );

  return (
    <div className="flex">
      <div className="flex-1 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            className="p-2"
            onClick={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() - 1,
                  1
                )
              )
            }
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="p-2"
            onClick={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  1
                )
              )
            }
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1" role="grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-bold"
              role="columnheader"
            >
              {day}
            </div>
          ))}
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} role="gridcell" aria-hidden="true" />
            ))}
          {renderCalendar()}
        </div>

        <div className="mt-4">
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>
              Reminders for today ({currentDate.toDateString()})
            </AlertTitle>
            <AlertDescription>
              {reminders.length > 0 ? (
                reminders.map((r, index) => <div key={index}>{r.task}</div>)
              ) : (
                <div>No tasks for today</div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="ml-8 w-1/3">
        <div>
          <TaskViewer tasks={tasks} selectedDate={selectedDate} />
        </div>
      </div>

      {showPopup && (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Task for {selectedDate.toDateString()}
              </DialogTitle>
            </DialogHeader>
            <input
              placeholder="Enter your task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="mb-4 bg-white border border-gray-300 rounded p-2"
            />
            <select
              value={recurrence}
              onChange={handleRecurrenceChange}
              className="w-full p-2 border border-gray-300 rounded mb-2 bg-white"
            >
              <option value="none">No recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>

            {recurrence === "custom" && (
              <div className="flex items-center mt-2 bg-white">
                <span className="mr-2">Every</span>
                <input
                  type="number"
                  name="value"
                  value={customRecurrence.value}
                  onChange={handleCustomRecurrenceChange}
                  className="w-16 p-1 border rounded mr-2 bg-white"
                  min="1"
                />
                <select
                  name="type"
                  value={customRecurrence.type}
                  onChange={handleCustomRecurrenceChange}
                  className="p-1 border rounded bg-white"
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                  <option value="years">years</option>
                </select>
              </div>
            )}
            <div className="flex items-center mb-4">
              <span className="mr-2">Start Date:</span>
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block mb-1" htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="p-2 border border-gray-300 rounded w-full bg-white"
              />
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <div className="bg-blue-500 rounded p-2">
                  <Button
                    onClick={handleTaskSubmit}
                    className="w-full text-white rounded"
                    disabled={!endDate}
                  >
                    Add Task
                  </Button>
                </div>
                {(task === "" || !endDate) && (
                  <div className="bg-blue-500 rounded p-2">
                    <Button onClick={() => setShowPopup(false)} className="w-full text-white rounded">
                      Close Task
                    </Button>
                  </div>
                )}
              </div>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DatePicker;