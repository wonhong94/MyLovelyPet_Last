import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = ({ date, setDate, tileContent, className }) => {
  return (
    <div className={className}>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />
    </div>
  );
};

export default CustomCalendar;