import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Divider, Select } from "antd";
import BottomSheet from "./BottomSheet";
import DatePicker from "./DatePicker";
import {
  createNewAppointment,
  getAffectedDates,
  getAppointmentTypes,
  getAvailableTimeSlots,
} from "../services/appointment.service";
import { useState } from "react";

function AddAppointmentSheet({ onClose }) {
  const [formData, setFormData] = useState({
    appointmentType: null,
    date: null,
    timeslot: null,
  });

  const { data: appointmentTypes, isPending: appointmentTypesPending } =
    useQuery({
      queryKey: ["appointmentTypes"],
      queryFn: getAppointmentTypes,
    });

  const { data: affectedDates, isPending: affectedDatesPending } = useQuery({
    queryKey: ["affectedDates"],
    queryFn: getAffectedDates,
  });

  const { data: timeslots, isPending: timeslotsPending } = useQuery({
    queryKey: ["timeslots", formData.date],
    queryFn: () => getAvailableTimeSlots(formData.date),
    enabled: formData.date !== null,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createNewAppointment,
    onSuccess: () => {
      onClose();
    },
  });

  const handleCreateAppointment = async () => {
    mutate(formData);
  };

  return (
    <BottomSheet onClose={onClose}>
      <h1 className="text-xl font-semibold">New Appointment</h1>
      <div className="flex flex-col mt-5">
        <Select
          size="large"
          placeholder="Select Appointment Type"
          loading={appointmentTypesPending}
          options={
            appointmentTypes?.map((type) => ({
              value: type,
              label: <span className="text-[1.1rem] font-medium">{type}</span>,
            })) || []
          }
          value={formData.appointmentType}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, appointmentType: val }))
          }
          className="w-full"
        />
        <Divider />
        <div className="flex flex-col gap-5 mb-9">
          <DatePicker
            affected={affectedDates}
            value={formData.date}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, date: val, timeSlot: null }));
            }}
          />
          <Select
            size="large"
            placeholder="Select Time Slot"
            options={
              timeslots?.map((slot, idx) => ({
                value: slot.slot,
                label: (
                  <span className="text-[1.1rem] font-medium">{slot.slot}</span>
                ),
                disabled: !slot.available,
              })) || []
            }
            value={formData.timeslot}
            loading={timeslotsPending}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, timeSlot: val }))
            }
            className="w-full"
            disabled={formData.date === null}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCreateAppointment}
            color="default"
            variant="solid"
            size="large"
            loading={isPending || isError}
          >
            Schedule
          </Button>
          <Button color="danger" variant="link" size="large" onClick={onClose}>
            Discard
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

export default AddAppointmentSheet;
