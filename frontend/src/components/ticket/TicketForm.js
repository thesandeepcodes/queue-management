import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/button";
import LoadingSpinner from "../common/LoadingSpinner";
import axios from "axios";

export default function TicketForm({ onTicketIssued }) {
  const [form, setForm] = useState({ name: "", phone: "", service: "" });
  const [services, setServices] = useState([]);
  const [waitTime, setWaitTime] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/services")
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (form.service) {
      axios.get(`/api/queue/estimate?service=${form.service}`)
        .then(res => setWaitTime(res.data.estimatedTime))
        .catch(() => setWaitTime(null));
    }
  }, [form.service]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/queue/take", form);
      onTicketIssued(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <div className="space-y-1">
        <label className="text-sm text-gray-700">Service</label>
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {waitTime && (
        <p className="text-sm text-gray-500">
          Estimated wait time: <strong>{waitTime} minutes</strong>
        </p>
      )}

      {loading ? <LoadingSpinner /> : <Button type="submit">Take Ticket</Button>}
    </form>
  );
}
