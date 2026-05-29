"use client";

import { User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Staff() {
  const [patientData, setPatientData] = useState(null);
  const [status, setStatus] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io({
      path: "/socket.io",
    });

    socketRef.current.on("patient-live-status", (data) => {
      setStatus((prev) => ({
        ...prev,
        [data.patientId]: data.status,
      }));
    });

    socketRef.current.on("patient-live-data", (data) => {
      setPatientData(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <>
      <div className="m-[3rem] flex flex-col gap-5">
        <h1 className="mb-[1rem] text-[1.5rem] font-bold">Admin Dashboard</h1>
        <h2 className="text-[1.15rem] font-bold">Real-Time Form Monitoring</h2>
        {Object.entries(status).map(([id, status]) => (
          <div
            key={id}
            className="p-[1rem] flex items-center justify-between rounded-xl bg-blue-100"
          >
            <div className="flex gap-2">
              <User />
              <span className="font-medium">ID: {id.slice(0, 6)}</span>
            </div>
            <span>{status}</span>
          </div>
        ))}
        {patientData ? (
          <div>
            <h3 className="font-bold">Personal Information</h3>
            <div className="m-5">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">First Name</span>
                <span>{patientData.firstName}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Middle Name</span>
                <span>{patientData.middleName}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Last Name</span>
                <span>{patientData.lastName}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Date of Birth</span>
                <span>{patientData.dateOfBirth}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Gender</span>
                <span>{patientData.gender}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Nationality</span>
                <span>{patientData.nationality}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Language</span>
                <span>{patientData.language}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Religion</span>
                <span>{patientData.religion}</span>
              </div>

              <hr className="my-2.5" />
            </div>
            <br />

            <h3 className="font-bold">Contact Information</h3>
            <div className="m-5">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Phone Number</span>
                <span>{patientData.phoneNumber}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Email</span>
                <span>{patientData.email}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Address</span>
                <span>{patientData.address}</span>
              </div>
              <hr className="my-2.5" />
            </div>
            <br />

            <h3 className="font-bold">Emergency Contact (Optional)</h3>
            <div className="m-5 ">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">name</span>
                <span>{patientData.emergencyContact.name}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">Relationship</span>
                <span>{patientData.emergencyContact.relationship}</span>
              </div>
              <hr className="my-2.5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <span className="font-semibold">emergencyPhone</span>
                <span>{patientData.emergencyContact.emergencyPhone}</span>
              </div>
              <hr className="my-2.5" />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
