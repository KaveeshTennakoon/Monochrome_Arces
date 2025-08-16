import { Button } from "antd";
import Logo from "./Logo";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddAppointmentSheet from "./AddAppointmentSheet";
import { AnimatePresence } from "motion/react";

function Navigation() {
  const [
    createAppointmentSheetVisibility,
    setCreateAppointmentSheetVisibility,
  ] = useState(false);

  return (
    <>
      <nav className="sticky top-0 left-0 flex justify-between items-center p-4 py-2 border-b-2 border-b-gray-200 bg-white z-50">
        <div className="flex items-center gap-5">
          <Logo width="30px" />
          <h1 className="text-[1.2rem] font-semibold text-center">
            Registrar General's Deparment
          </h1>
        </div>
        <Button onClick={() => setCreateAppointmentSheetVisibility(true)}>
          <PlusOutlined className="text-xl" />
        </Button>
      </nav>

      <AnimatePresence>
        {createAppointmentSheetVisibility && (
          <AddAppointmentSheet
            onClose={() => setCreateAppointmentSheetVisibility(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
