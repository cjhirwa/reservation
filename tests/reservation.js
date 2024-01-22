import  Reservation from '../src/models/reservation'
import reservationController from '../src/controllers/reservation';

jest.mock('../src/models/reservation');
describe('Reservation Controller', () => {
  describe('makeReservation', () => {
      test("Should successfully create a reservation", async () => {
        const mockRequest = {
          body: {
            specialInfo: "special_info"
          },
          params: {
            cindate: "2023-01-01",
            coutdate: "2023-01-02",
            room: "659d4dcb43c304dfe05865f9",
          },
          customer: {
            _id: "659d4dcf43c304dfe05865fd"
          }
        };
    
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Define expected data
        const expectedReservation = {
          _id: expect.any(Object),
          room_id: { id: "659d4dcb43c304dfe05865f9" },
          customer_id: { id: "659d4dcf43c304dfe05865fd" },
          reference: expect.anything(),
          checkInDate: expect.anything(),
          checkOutDate: expect.anything(),
          status: "pending",
          __v: 0
        };
    
        // Mocking makeReservation.save to return the created Reservation
        Reservation.prototype.save.mockResolvedValue(expectedReservation);
    
        // Calling the makeReservation function
        await reservationController.makeReservation(mockRequest, mockResponse);
    
        // Verify the expected behavior of the reservation creation process
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(expectedReservation));
        expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
      });
    
      afterEach(() => {
        jest.clearAllMocks(); 
      });
    });

    test('should handle error when creating reservation', async () => {
      const mockRequest = {
        body: {
          special_info: 'Some special info',
        },
        params: {
          cindate: '2024-01-15',
          coutdate: '2024-01-20',
          room: 'roomId123', // Replace with a valid room ID for testing
        },
        customer: {
          _id: 'customerId123', // Replace with a valid customer ID for testing
        },
      };

      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(),
      };

      Reservation.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await reservationController.makeReservation(mockRequest, mockResponse);

      expect(Reservation.prototype.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
