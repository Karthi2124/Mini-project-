import { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    symptoms: '',
    date: '',
    time: '',
    doctor: '',
    hospital: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const hospitals = [
    "Apollo Hospital",
    "Fortis Hospital",
    "MIOT International",
    "Global Hospitals",
    "Kauvery Hospital"
  ];

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If hospital or specialization changes, fetch available doctors
    if (name === 'hospital' || name === 'specialization') {
      // In a real app, you would fetch from backend
      const mockDoctors = [
        { id: 1, name: "Dr. Smith", specialization: "Cardiologist" },
        { id: 2, name: "Dr. Johnson", specialization: "General Physician" },
        { id: 3, name: "Dr. Williams", specialization: "Neurologist" }
      ];
      setAvailableDoctors(mockDoctors);
    }

    // If doctor or date changes, fetch available slots
    if ((name === 'doctor' && value) || (name === 'date' && value)) {
      // In a real app, you would fetch from backend
      const mockSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM"];
      setAvailableSlots(mockSlots);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send to backend
    console.log("Appointment booked:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="appointment-confirmation">
        <div className="confirmation-icon">
          <i className="ri-checkbox-circle-fill"></i>
        </div>
        <h2>Appointment Booked Successfully!</h2>
        <p>Your appointment details have been sent to your email.</p>
        <div className="appointment-details">
          <p><strong>Doctor:</strong> {formData.doctor}</p>
          <p><strong>Date:</strong> {formData.date} at {formData.time}</p>
          <p><strong>Hospital:</strong> {formData.hospital}</p>
        </div>
        <button 
          className="new-appointment-btn"
          onClick={() => setSubmitted(false)}
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-form-container">
      <div className="form-header">
        <h2>Book Doctor Appointment</h2>
        <p>Fill in your details to schedule an appointment</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Describe Your Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            rows="3"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Select Hospital</label>
            <select
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <select
              name="specialization"
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {availableDoctors.length > 0 && (
          <div className="form-group">
            <label>Select Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {availableDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {availableSlots.length > 0 && (
            <div className="form-group">
              <label>Available Time Slots</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;