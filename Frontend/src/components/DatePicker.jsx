import { DatePicker as AntdDatePicker } from "antd";
import dayjs from "dayjs";

function DatePicker({ affected, value, onChange }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "full":
        return { backgroundColor: "red", color: "white" };
      case "almost":
        return { backgroundColor: "orange", color: "white" };
      default:
        return { backgroundColor: "green", color: "white" };
    }
  };
  return (
    <AntdDatePicker
      size="large"
      value={value ? dayjs(value) : null}
      onChange={(date) => {
        onChange?.(date ? date.format("YYYY-MM-DD") : null);
      }}
      disabledDate={(current) => {
        if (!current) return false;
        if (current < dayjs().startOf("day")) return true;
        if (current.day() === 0 || current.day() === 6) return true;

        const dateKey = current.format("YYYY-MM-DD");
        if (affected[dateKey] === "full") return true;

        return false;
      }}
      dateRender={(current) => {
        const dateKey = current.format("YYYY-MM-DD");
        const status = affected[dateKey];

        let style = {};

        if (current < dayjs().startOf("day")) {
          style = { backgroundColor: "#d9d9d9", color: "white" };
        } else if (current.day() === 0 || current.day() === 6) {
          style = { backgroundColor: "#595959", color: "white" };
        } else {
          style = getStatusStyle(status);
        }

        return (
          <div
            className="ant-picker-cell-inner"
            style={{
              ...style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              margin: "auto",
              borderRadius: "4px",
            }}
          >
            {current.date()}
          </div>
        );
      }}
    />
  );
}

export default DatePicker;
