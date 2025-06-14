export default function TicketDisplay({ ticket }) {
  return (
    <div className="bg-green-100 p-6 rounded-xl shadow text-center space-y-2">
      <h2 className="text-xl font-semibold text-green-800">🎫 Ticket #{ticket.number}</h2>
      <p className="text-gray-700">Service: {ticket.serviceName}</p>
      <p className="text-gray-600">We'll notify you when it's almost your turn.</p>
      <p className="text-xs text-gray-500">Save this ID: {ticket.id}</p>
    </div>
  );
}
