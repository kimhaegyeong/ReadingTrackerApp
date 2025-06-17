import { useState } from 'react';

type DateTimePickerMode = 'date' | 'time' | 'datetime' | 'countdown';

export const useDateTimePicker = (initialMode: DateTimePickerMode = 'datetime') => {
  const [mode, setMode] = useState<DateTimePickerMode>(initialMode);
  const [show, setShow] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const showPicker = (date: Date, pickerMode: DateTimePickerMode = initialMode) => {
    setMode(pickerMode);
    setCurrentDate(date);
    setShow(true);
  };

  const hidePicker = () => {
    setShow(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    hidePicker();
    if (selectedDate) {
      setCurrentDate(selectedDate);
      return selectedDate;
    }
    return currentDate;
  };

  return {
    mode,
    show,
    currentDate,
    showPicker,
    hidePicker,
    handleDateChange,
  };
};
