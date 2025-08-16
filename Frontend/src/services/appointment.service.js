// TODO: 
export async function getAppointmentTypes() {
  return ["Deed Registration", "Title Registration (Bim Saviya Program)", "Certified Copies / Extracts of Deeds"];
}

// TODO: 
export async function getAffectedDates() {
    return {
        "2025-08-20": "full",
        "2025-08-22": "almost",
    }
}

// TODO: 
export async function getAvailableTimeSlots(date) {
  return [
    { slot: "09:00 AM – 09:30 AM", available: true },
    { slot: "09:30 AM – 10:00 AM", available: false },
    { slot: "10:00 AM – 10:30 AM", available: true },
    { slot: "10:30 AM – 11:00 AM", available: true },
    { slot: "11:00 AM – 11:30 AM", available: false },
    { slot: "02:00 PM – 02:30 PM", available: true },
    { slot: "02:30 PM – 03:00 PM", available: true },
    { slot: "03:00 PM – 03:30 PM", available: true },
  ];
}

// TODO: 
export async function createNewAppointment(appointmentType, date, timeslot) {
    return await api.post('/appointment', {
        appointmentType, 
        date,
        timeslot,
    });
}

// TODO: 
export async function getUpcomingAppointments() {
  return [
    {
      referenceId: "APT-001",
      appointmentType: "Deed Registration",
      date: "2025-08-20",
      timeslot: "09:00 AM – 09:30 AM",
    },
    {
      referenceId: "APT-002",
      appointmentType: "Title Registration (Bim Saviya Program)",
      date: "2025-08-21",
      timeslot: "10:00 AM – 10:30 AM",
    },
    {
      referenceId: "APT-003",
      appointmentType: "Certified Copies / Extracts of Deeds",
      date: "2025-08-22",
      timeslot: "02:00 PM – 02:30 PM",
    },
  ];
}

// TODO: 
export async function getPastAppointments() {
  return [
    {
      referenceId: "APT-001",
      appointmentType: "Deed Registration",
      date: "2025-08-20",
      timeslot: "09:00 AM – 09:30 AM",
    },
    {
      referenceId: "APT-002",
      appointmentType: "Title Registration (Bim Saviya Program)",
      date: "2025-08-21",
      timeslot: "10:00 AM – 10:30 AM",
    },
    {
      referenceId: "APT-003",
      appointmentType: "Certified Copies / Extracts of Deeds",
      date: "2025-08-22",
      timeslot: "02:00 PM – 02:30 PM",
    },
  ];
}
