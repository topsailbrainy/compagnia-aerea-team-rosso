type Booking = {
  id: string;
  userId: string;
  flightId: string;
};

let bookings: Booking[] = [];

export const getBookings = async () => {
  return bookings;
};

export const getBookingById = async (id: string) => {
  return bookings.find(b => b.id === id);
};

export const createBooking = async (data: Omit<Booking, "id">) => {
  const newBooking: Booking = {
    id: Date.now().toString(),
    ...data
  };

  bookings.push(newBooking);
  return newBooking;
};