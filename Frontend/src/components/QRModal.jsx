import { Modal } from "antd";

function QRModal({
  referenceId,
  appointmentDate,
  timeSlots,
  visible = false,
  onClose,
}) {
  const qrData = `${referenceId}|${appointmentDate}|${timeSlots}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <Modal
      title="Appointment QR Code"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={300}
    >
      <div>
        <img src={qrUrl} alt="QR Code" className="w-full mb-2 mt-5" />
        <div className="font-medium">
          <div>ID: {referenceId}</div>
          <div>Date: {appointmentDate}</div>
          <div>Time: {timeSlots}</div>
        </div>
      </div>
    </Modal>
  );
}

export default QRModal;
