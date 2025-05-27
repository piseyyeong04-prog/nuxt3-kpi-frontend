
// types/booking.ts
export interface Booking {
  id?: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
  status: string;
  date_created?: string;
  updated_at?: string;
}

export interface ParsedBookingData {
  date: string;
  start_time: string;
  end_time: string;
}