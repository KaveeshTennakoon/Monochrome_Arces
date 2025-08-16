import { Badge, Col, Row } from "antd";
import { Collapse } from "antd";
import Navigation from "../components/Navigation";
import {
  getPastAppointments,
  getUpcomingAppointments,
} from "../services/appointment.service";
import { useQuery } from "@tanstack/react-query";
import UpcomingAppointmentCard from "../components/UpcomingAppointmentCard";
import { PlusOutlined } from "@ant-design/icons";
import PastAppointmentCard from "../components/PastAppointmentCard";

function Home() {
  const { data: upcomingAppointments } = useQuery({
    queryKey: ["upcoming-appointments"],
    queryFn: getUpcomingAppointments,
  });

  const { data: pastAppointments } = useQuery({
    queryKey: ["past-appointments"],
    queryFn: getPastAppointments,
  });

  return (
    <>
      <Navigation />
      <main className="flex flex-col justify-center py-2">
        <div className="p-5">
          {upcomingAppointments?.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                No Upcoming Appointments
              </h2>
              <p className="text-gray-600">
                You currently have no upcoming appointments. Click the
                <PlusOutlined /> button above to schedule.
              </p>
            </div>
          ) : (
            upcomingAppointments?.map((appointment) => (
              <UpcomingAppointmentCard
                key={appointment.referenceId}
                appointment={appointment}
              />
            ))
          )}
        </div>
        <Collapse
          ghost
          items={[
            {
              key: "1",
              label: (
                <Row
                  justify="space-between"
                  align="middle"
                  style={{ width: "100%" }}
                >
                  <Col>
                    <h1 className="text-lg font-semibold text-black">
                      Past Appointments
                    </h1>
                  </Col>
                  <Col>
                    <Badge
                      count={pastAppointments?.length}
                      showZero
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  </Col>
                </Row>
              ),
              children: (
                <>
                  {pastAppointments?.map((appointment) => (
                    <PastAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </>
              ),
            },
          ]}
        />
      </main>
    </>
  );
}

export default Home;
