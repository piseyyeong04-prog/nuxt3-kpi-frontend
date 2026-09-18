
// types/booking.ts
export interface Booking {
  date: string;
  id?: string;
  start: string;
  end: string;
  purpose: string;
  room?: string;
  status: string;
  date_created?: string;
  updated_at?: string;
  user_created?: string;
}

export interface ParsedBookingData {
  purpose: string;
  date: string; // Format: YYYY-MM-DD
  date_created: string;
  start_time: string;
  end_time: string;
  room?: string;
}