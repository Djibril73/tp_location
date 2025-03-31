// src/components/DateSelection.jsx
import React, { useState } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

const DateSelection = ({ onDatesSelected }) => {
  // selectedDayRange sera un objet avec deux propriétés : from et to
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });

  // Quand l'utilisateur confirme son choix, on convertit les objets { day, month, year } en Date
  const handleConfirm = () => {
    if (selectedDayRange.from && selectedDayRange.to) {
      const { from, to } = selectedDayRange;
      const startDate = new Date(from.year, from.month - 1, from.day);
      const endDate = new Date(to.year, to.month - 1, to.day);
      // Appeler le callback passé en prop pour transmettre les dates au parent
      if (onDatesSelected) {
        onDatesSelected(startDate, endDate);
      }
    } else {
      alert("Veuillez sélectionner une plage de dates.");
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 9999, background: '#fff', padding: '1rem', borderRadius: '8px' }}>
      <Calendar
        value={selectedDayRange}
        onChange={setSelectedDayRange}
        shouldHighlightWeekends
        colorPrimary="#007bff"
      />
      <button onClick={handleConfirm} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Confirmer
      </button>
    </div>
  );
};

export default DateSelection;