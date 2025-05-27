import type { Booking } from "~/types/booking";

export const useBooking = () => {
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'date_created' | 'updated_at'>) => {
    try {
      const response = await useApi<Booking>('/items/booking_room', {
        method: 'POST',
        data: bookingData
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getBookings = async () => {
    try {
      const response = await useApi<{ data: Booking[] }>('/items/booking_room', {
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    try {
      const response = await useApi<Booking>(`/items/booking_room/${id}`, {
        method: 'PATCH',
        data: bookingData
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await useApi(`/items/booking_room/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
  };
};