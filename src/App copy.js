import React, { useState } from 'react';
import { Select } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './App.css';

function App() {
  const [search, setSearch] = useState('');

  const options = [
    { value: '1', label: 'คุณหมอ สมมติ ทดสอบ' },
    { value: '2', label: 'คุณหมอ test' },
  ];

  function generateTimes() {
    let times = [];
    let startTime = new Date();
    startTime.setHours(7, 0, 0, 0);

    for (let i = 0; i < 41; i++) {
      let timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      times.push({ time: timeString });
      startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return times;
  }

  const appointments = [
    { start: '11:00 AM', end: '11:15 AM', patient: 'นายสมชาย', symptom: 'ปวดท้อง', status: 'confirmed' },
  ];

  const times = generateTimes();

  const convertTo24Hour = (timeString) => {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return new Date(1970, 0, 1, hours, minutes);
  };

  const calculateRowSpan = (start, end) => {
    const startTime = convertTo24Hour(start);
    const endTime = convertTo24Hour(end);
    const diffInMinutes = (endTime - startTime) / 60000;
    return Math.ceil(diffInMinutes / 15);
  };

  const isTimeInAppointment = (timeString) => {
    return appointments.some(app => {
      const appStart = convertTo24Hour(app.start);
      const appEnd = convertTo24Hour(app.end);
      const currentTime = convertTo24Hour(timeString);
      // รวมเวลาสิ้นสุดเข้าไปในการตรวจสอบด้วย
      return currentTime >= appStart && currentTime <= appEnd;
    });
  };

  const getAppointmentForTime = (timeString) => {
    return appointments.find(app => {
      const appStart = convertTo24Hour(app.start);
      const currentTime = convertTo24Hour(timeString);
      return currentTime.getTime() === appStart.getTime();
    });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="section">
          <div>
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder="ค้นหาคุณหมอ"
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={options}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2F4169', color: 'white', marginTop: 10, borderRadius: 6, padding: 10 }}>
            <h2>ทันตแพทย์</h2>
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774293.png" alt="ทันตแพทย์" width={50} height={50} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: '#9DDDCC', borderRadius: 6 }}>
            <div className="icon-clock" style={{ marginRight: 5 }}>
              <ClockCircleOutlined />
            </div>
            <span>เวลาเข้างาน 09:00 - 19:00 น</span>
          </div>

          <div className="schedule-container">
            <h1>ตารางนัดคนไข้ของหมอ</h1>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>คนไข้</th>
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => {
                  const appointment = getAppointmentForTime(time.time);
                  const isOccupied = isTimeInAppointment(time.time);

                  if (appointment) {
                    return (
                      <tr key={index}>
                        <td>{time.time}</td>
                        <td rowSpan={calculateRowSpan(appointment.start, appointment.end)}>
                          {appointment.patient}
                        </td>
                      </tr>
                    );
                  }

                  if (isOccupied) {
                    return (
                      <tr key={index}>
                        <td>{time.time}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={index}>
                      <td>{time.time}</td>
                      <td>ว่าง</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;