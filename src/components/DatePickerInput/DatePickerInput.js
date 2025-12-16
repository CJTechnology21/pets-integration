import React, { useMemo, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import CustomTextInput from '../textInput/CustomTextInput';

const DEFAULT_FORMAT = 'DD/MM/YYYY';

const formatDate = (date, format = DEFAULT_FORMAT) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

const parseDateString = (value) => {
  if (!value) {
    return null;
  }

  const parts = value.split(/[\/\-]/);
  if (parts.length < 3) {
    return null;
  }

  const [first, second, third] = parts;

  // handle DD/MM/YYYY vs YYYY-MM-DD
  let day;
  let month;
  let year;

  if (third.length === 4) {
    // assume DD/MM/YYYY
    day = parseInt(first, 10);
    month = parseInt(second, 10);
    year = parseInt(third, 10);
  } else if (first.length === 4) {
    // assume YYYY-MM-DD
    year = parseInt(first, 10);
    month = parseInt(second, 10);
    day = parseInt(third, 10);
  } else {
    return null;
  }

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const candidate = new Date(year, month - 1, day);
  return isNaN(candidate.getTime()) ? null : candidate;
};

const DatePickerInput = ({
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  mode = 'date',
  format = DEFAULT_FORMAT,
  leftIcon = 'calendar-outline',
  error,
  locale = 'en',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  title,
}) => {
  const [open, setOpen] = useState(false);

  const dateForPicker = useMemo(() => {
    const parsed = parseDateString(value);
    return parsed || new Date();
  }, [value]);

  const handleConfirm = (selectedDate) => {
    setOpen(false);
    if (onChange) {
      onChange(formatDate(selectedDate, format));
    }
  };

  return (
    <>
      <CustomTextInput
        placeholder={placeholder}
        value={value}
        editable={false}
        leftIcon={leftIcon}
        error={error}
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={dateForPicker}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={locale}
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default DatePickerInput;

