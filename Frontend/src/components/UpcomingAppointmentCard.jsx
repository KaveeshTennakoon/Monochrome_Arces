import { Button, Divider } from "antd";
import { QrcodeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useState } from "react";
import QRModal from "./QRModal";

function UpcomingAppointmentCard({ appointment }) {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <div key={appointment.id} className="">
        <div className="">
          <div className="flex justify-center bg-[#1890ff] text-white rounded-lg text-center mb-[12px]">
            <CalendarOutlined
              style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}
            />
            <div className="flex gap-2 text-[1.1rem] font-medium">
              <div>{appointment.date}</div>
              <div>{appointment.timeslot}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-semibold text-lg">
                {appointment.appointmentType}
              </div>
              <div className="text-[#666] text-[0.9rem]">
                {appointment.referenceId}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginLeft: "8px" }}>
              <Button
                size="large"
                type="text"
                icon={<QrcodeOutlined style={{ fontSize: "1.2rem" }} />}
                onClick={() => setShowQRModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <QRModal
        referenceId={appointment.referenceId}
        appointmentDate={appointment.date}
        timeSlots={appointment.timeslot}
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
      <Divider />
    </>
  );
}

export default UpcomingAppointmentCard;
