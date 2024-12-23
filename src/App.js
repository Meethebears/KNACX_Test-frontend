import React, { useState } from 'react';
import { Card, Modal, Select, Dropdown, Button } from 'antd';
import { ClockCircleOutlined, RedoOutlined, StopOutlined } from '@ant-design/icons';
import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [datatoModal, setDatatoModal] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const options = [
    { value: '1', label: 'คุณหมอสมมติ ทดสอบ', position: 'ทันตแพทย์', img: 'https://cdn-icons-png.flaticon.com/512/3774/3774293.png' },
    { value: '2', label: 'คุณหมอtest', position: 'ทันตแพทย์', img: 'https://cdn-icons-png.flaticon.com/512/9193/9193824.png' },
  ];

  const appointments = [
    { start: '11:00 AM', end: '11:15 AM', patient: 'คนไข้ทดสอบ ทดสอบ', symptom: 'รักษารากฟัน', status: 'confirmed', HN: '640002', tel: '0812345678', doctorId: '1' },
  ];

  const PatientQueue = [
    { room: '05', HN: '6401023', patient: 'วรภัทร บารมี', day: '9 วัน', status: 'แอดมิน' },
    { room: '03', HN: '6401009', patient: 'การดา สุขสวัสดิ์', day: '5 วัน', status: 'จุดชำระเงิน' },
  ]

  function generateTimes() {
    let times = [];
    let startTime = new Date();
    startTime.setHours(7, 0, 0, 0);

    for (let i = 0; i < 41; i++) {
      let timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      times.push({ time: timeString });
      startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return times;
  }

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
    return Math.ceil(diffInMinutes / 15 + 1);
  };

  const isTimeInAppointment = (timeString) => {
    const data = appointments.filter(app => app.doctorId === selectedDoctor?.value);
    return data?.some(app => {
      const appStart = convertTo24Hour(app.start);
      const appEnd = convertTo24Hour(app.end);
      const currentTime = convertTo24Hour(timeString);
      return currentTime >= appStart && currentTime <= appEnd;
    });
  };

  const getAppointmentForTime = (timeString) => {
    return appointments.filter(app => {
      const appStart = convertTo24Hour(app.start);
      const currentTime = convertTo24Hour(timeString);
      return currentTime.getTime() === appStart.getTime() && app.doctorId === selectedDoctor?.value;
    })[0];
  };

  const showModal = (data) => {
    if (!open) { 
      setOpen(true);
      setDatatoModal(data);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const titleModal = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: 15 }}>
      <div>
        <div style={{ color: 'green' }}>นัดหมาย</div>
        <div style={{ color: 'green' }}>{selectedDoctor?.position + " " + selectedDoctor?.label}</div>
      </div>
      <div>
        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774293.png" alt="ทันตแพทย์" width={50} height={50} />
      </div>
    </div>
  );

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleDropdown = (option) => {
    setSelectedDoctor(option);
    setDropdown(false);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="sections" style={{ flex: 1 }}>
          <div>
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder="ค้นหาคุณหมอ"
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={options}
              onChange={(value, option) => setSelectedDoctor(option)}
              value={selectedDoctor}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2F4169', marginTop: 10, borderRadius: 6, padding: 10 }}>
            <h2 style={{ color: 'white' }}>ทันตแพทย์</h2>
            {selectedDoctor ? <img className="dropdown-btn" src={selectedDoctor.img} alt="ทันตแพทย์" width={50} height={50} style={{ cursor: 'pointer' }} onClick={toggleDropdown} /> : <img src='https://t3.ftcdn.net/jpg/02/29/53/12/360_F_229531203_6rLFz47K3Vc7W0IKnDx0S4SZFhtiBtv8.jpg' width={50} height={50} style={{ cursor:'pointer', borderRadius: '50%', marginRight: 20 }} onClick={toggleDropdown}/>}
            <div className={`dropdown-menu ${dropdown ? 'show' : 'hide'}`}>
              {options.map((option) => (
                <div key={option.value} className="dropdown-item">
                  <img src={option.img} alt={`Option ${option.value}`} className="dropdown-image" width={40} height={40} onClick={() => handleDropdown(option)} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: '#9DDDCC', borderRadius: 6 }}>
            <div className="icon-clock" style={{ marginRight: 5 }}>
              <ClockCircleOutlined />
            </div>
            <span>เวลาเข้างาน 09:00 - 19:00 น</span>
          </div>

          <div className="schedule-container">
            <table className="schedule-table">
              <thead>
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
                          <Card style={{ cursor: 'pointer', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)' }} onClick={() => showModal(appointment)}>
                            {appointment.patient + " | " + appointment.symptom + " | " + appointment.HN + " | " + appointment.tel + " | " + appointment.start + "-" + appointment.end}
                          </Card>
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
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sections" style={{ flex: 1, paddingLeft: 25 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 600 }}>วันที่ 30 ม.ค. 2564</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 2, width: 235, height: 35, backgroundColor: '#D8E8F4', color: '#ED8644', fontWeight: 500 }}>รายได้ทั้งหมด 0.00 บาท</div>
              <button style={{ cursor:'pointer',color: 'orange', background: 'white', border: '2px solid orange', borderRadius: 6, width: 40, height: 35, marginLeft: 10, fontSize: 15, boxShadow: '2px 2px 10px 0px rgba(0, 0, 0, 0.2)' }}><RedoOutlined /> </button>
            </div>
          </div>
          <div style={{ display: 'flex', paddingTop: 5 }}>
            <div className='special-room' style={{ flexGrow: 1, marginRight: 10, borderRadius: 6, boxShadow: '2px 2px 7px 0px rgba(0, 0, 0, 0.2)' }}>
              <div className='title-special-room'>ห้องพิเศษ present</div>
              <div className='list-special-room'>
                <div style={{ display: 'flex', alignItems: "center", height: '100%', flexDirection: 'column' }}>
                  {PatientQueue.map((data, index) => {
                    if (data.status === 'ห้องพิเศษ') {
                      return (
                        <div style={{ width: '90%', height: '100px', borderRadius: 6, backgroundColor: 'white', marginTop: 20, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <div id='queue' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B8A9', color: 'white', borderTopLeftRadius: '8px', borderBottomRightRadius: '12px', width: '30px', fontSize: 14 }}>{index + 1}</div>
                              <div style={{ fontWeight: 600, paddingLeft: 8, fontSize: 14 }}>{data.patient}
                                <div style={{ textAlign: 'center', fontWeight: 400 }}>{data.HN}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#2F4269', color: 'white', margin: 5, width: 25, height: 25, borderTopRightRadius: 6, fontSize: 14 }}>{data.room}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img src="https://cdn-icons-png.freepik.com/512/8484/8484076.png" alt="user" width={40} height={40} style={{ background: 'transparent', borderRadius: '50%', opacity: '0.2' }} />
                            <div style={{ color: 'red', marginRight: 10, cursor: 'pointer' }}><StopOutlined /></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>{data.day}</div>
                        </div>
                      )
                    }

                  })}
                </div>
              </div>
            </div>
            <div className='special-room' style={{ flexGrow: 2, marginRight: 10, boxShadow: '2px 2px 7px 0px rgba(0, 0, 0, 0.2)' }}>
              <div className='title'>แอดมิน</div>
              <div className='list'>
                <div style={{ display: 'flex', alignItems: "center", height: '100%', flexDirection: 'column' }}>
                  {PatientQueue.map((data, index) => {
                    if (data.status === 'แอดมิน') {
                      return (
                        <div style={{ width: '90%', height: '100px', borderRadius: 6, backgroundColor: 'white', marginTop: 20, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <div id='queue' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B8A9', color: 'white', borderTopLeftRadius: '8px', borderBottomRightRadius: '12px', width: '30px', fontSize: 14 }}>{index + 1}</div>
                              <div style={{ fontWeight: 600, paddingLeft: 8, fontSize: 14 }}>{data.patient}
                                <div style={{ textAlign: 'center', fontWeight: 400 }}>{data.HN}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#2F4269', color: 'white', margin: 5, width: 25, height: 25, borderTopRightRadius: 6, fontSize: 14 }}>{data.room}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img src="https://cdn-icons-png.freepik.com/512/8484/8484076.png" alt="user" width={40} height={40} style={{ background: 'transparent', borderRadius: '50%', opacity: '0.2' }} />
                            <div style={{ color: 'red', marginRight: 10, cursor: 'pointer' }}><StopOutlined /></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>{data.day}</div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </div>

            <div className='special-room' style={{ flexGrow: 2, boxShadow: '2px 2px 7px 0px rgba(0, 0, 0, 0.2)' }}>
              <div className='title'>จุดชำระเงิน</div>
              <div className='list-checkout'>
                <div style={{ display: 'flex', alignItems: "center", height: '100%', flexDirection: 'column' }}>
                  {PatientQueue.map((data, index) => {
                    if (data.status === 'จุดชำระเงิน') {
                      return (
                        <div style={{ width: '90%', height: '100px', borderRadius: 6, backgroundColor: 'white', marginTop: 20, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <div id='queue' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B8A9', color: 'white', borderTopLeftRadius: '8px', borderBottomRightRadius: '12px', width: '30px', fontSize: 14 }}>{index + 1}</div>
                              <div style={{ fontWeight: 600, paddingLeft: 8, fontSize: 14 }}>{data.patient}
                                <div style={{ textAlign: 'center', fontWeight: 400 }}>{data.HN}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#2F4269', color: 'white', margin: 5, width: 25, height: 25, borderTopRightRadius: 6, fontSize: 14 }}>{data.room}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img src="https://cdn-icons-png.freepik.com/512/8484/8484076.png" alt="user" width={40} height={40} style={{ background: 'transparent', borderRadius: '50%', opacity: '0.2' }} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img src="https://icon-library.com/images/icon-export/icon-export-1.jpg" alt="export" width="20" height="15" style={{ marginRight: 5, cursor: 'pointer', opacity: '0.2', marginTop: 2 }} />
                              <div style={{ color: 'red', marginRight: 10, cursor: 'pointer' }}><StopOutlined /></div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>{data.day}</div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>


      <Modal
        title={titleModal}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
          <img src="https://image.pngaaa.com/603/5170603-middle.png" alt="user" width={30} height={30} style={{ background: 'transparent' }} />
          {datatoModal?.HN + " | " + datatoModal?.patient}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://img.freepik.com/premium-vector/teeth-tooth-logo-design-vector-illustration_898026-1293.jpg" alt="service" width={35} height={35} />
          {"บริการ " + datatoModal?.symptom}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://therapynow.ie/wp-content/uploads/2023/03/499-4994239_telephone-green-phone-symbol-hd-png-download-removebg-preview.png" alt="tel" width={30} height={25} />
          {datatoModal?.tel}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://img.icons8.com/ios11/512/40C057/clock.png" alt="clock" width={30} height={30} />
            {datatoModal?.start + " - " + datatoModal?.end}
          </div>
          <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9tqvs4JdYhhUBh7AIVLJJKX5MgpUciGvvw&s" alt="print" width="35" height="35" style={{ marginRight: 25, cursor: 'pointer' }} />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtaFjKDcV8Dh3BgRsnzncbvRltPyTW95dPir0R8NN_7Orv7F85A9f35HuDDLZR7m_dxY&usqp=CAU" alt="edit" width="35" height="35" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </Modal>

      {dropdown && <Dropdown
        menu={{
          options,
        }}
        placement="bottomRight"
        arrow={{
          pointAtCenter: true,
        }}
      >
        <Button>bottomRight</Button>
      </Dropdown>}
    </div>

  );
}

export default App;