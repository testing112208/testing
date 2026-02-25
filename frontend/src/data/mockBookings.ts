export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  pickup: string;
  drop: string;
  cabType: string;
  date: string;
  time: string;
  status: BookingStatus;
  fare: number;
  createdAt: string;
}

export const mockBookings: Booking[] = [
  { id: "BK-1001", customerName: "Rajesh Sharma", phone: "+91 94220 31245", email: "rajesh.s@email.com", pickup: "Amravati Railway Station", drop: "Chikhaldara Hill Station", cabType: "SUV Taxi Service", date: "2026-02-08", time: "06:30", status: "Confirmed", fare: 2800, createdAt: "2026-02-06" },
  { id: "BK-1002", customerName: "Priya Deshmukh", phone: "+91 93736 28103", email: "priya.d@email.com", pickup: "Amravati Bus Stand", drop: "Nagpur Airport", cabType: "Sedan Cab Amravati", date: "2026-02-09", time: "08:00", status: "Pending", fare: 3200, createdAt: "2026-02-07" },
  { id: "BK-1003", customerName: "Vikram Patil", phone: "+91 87654 32109", email: "vikram.p@email.com", pickup: "Badnera Junction", drop: "Aurangabad City", cabType: "Sedan Cab Amravati", date: "2026-02-07", time: "14:00", status: "Completed", fare: 4500, createdAt: "2026-02-05" },
  { id: "BK-1004", customerName: "Sneha Kulkarni", phone: "+91 76543 21098", email: "sneha.k@email.com", pickup: "Paratwada", drop: "Pune Airport", cabType: "SUV Taxi Service", date: "2026-02-10", time: "05:00", status: "Confirmed", fare: 8500, createdAt: "2026-02-07" },
  { id: "BK-1005", customerName: "Amit Joshi", phone: "+91 65432 10987", email: "amit.j@email.com", pickup: "Amravati City Center", drop: "Shirdi Temple", cabType: "Tempo Traveller Taxi", date: "2026-02-11", time: "04:30", status: "Pending", fare: 7200, createdAt: "2026-02-08" },
  { id: "BK-1006", customerName: "Neha Wagh", phone: "+91 93456 78901", email: "neha.w@email.com", pickup: "Morshi Road", drop: "Mumbai Dadar", cabType: "Sedan", date: "2026-02-06", time: "22:00", status: "Cancelled", fare: 6800, createdAt: "2026-02-04" },
  { id: "BK-1007", customerName: "Saurabh Ingle", phone: "+91 82345 67890", email: "saurabh.i@email.com", pickup: "Camp Area Amravati", drop: "Lonar Crater Lake", cabType: "SUV", date: "2026-02-12", time: "07:00", status: "Pending", fare: 3500, createdAt: "2026-02-09" },
  { id: "BK-1008", customerName: "Kavita Raut", phone: "+91 71234 56789", email: "kavita.r@email.com", pickup: "Warud", drop: "Nagpur Railway Station", cabType: "Sedan", date: "2026-02-05", time: "16:00", status: "Completed", fare: 2600, createdAt: "2026-02-03" },
];
