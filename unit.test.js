import Reservation from "./src/models/reservation";
import reservationController from "./src/controllers/reservation";
import Room from "./src/models/room";
import roomController from "./src/controllers/room";
import User from "./src/models/user";
import userController from "./src/controllers/user";

// Test room creation functionality
jest.mock('./src/models/room');
describe("roomController", () => {
  test("Should successfully create a room", async () => {
    const mockRequest = {
      body: {
        name: "Test name",
        price: 50,
        specifications: "lorem ipsum 2",
        category_id: "659d4dcb43c304dfe06f26b9"
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Define expected data
    const expectedRoom = {
      "_id": "TestId",
      "category_id": { id: "659d4dcb43c304dfe05865f9" },
      "name": "Test name",
      "createdAt": expect.anything(),
      "updatedAt": expect.anything(),
      "__v": 0
    };

    // Mocking roomController.createRoom to return the created room
    Room.prototype.save.mockResolvedValue(expectedRoom);

    // Calling the roomController function
    await roomController.createRoom(mockRequest, mockResponse);

    // Verify the expected behavior of the reservation creation process
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({_id: "TestId"}));
    expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });
});


// Test room reservation functionality
jest.mock('./src/models/reservation');
describe("reservationController", () => {
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
      _id: "ExpectedID",
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
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({_id: "ExpectedID"}));
    expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });
});



// Testing user account creation
jest.mock('./src/models/user');
describe('testing user creation functionality', () => {
  describe('Testing user registration', () => {
      test('should return the user account created', async () => {
          const mockRequest = {
            body: {
              firstName: "Nambaje",
              lastName: "Edwin",
              email: `john.doe.${Math.random()}@example.com`,
              role: "admin"
            }
          };

          const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };

          // Define expected data
          const expectedUser = {
            _id: "ExpectedUserId",
            firstName: "Nambaje",
            lastName: "Edwin",
            email: `john.doe.${Math.random()}@example.com`,
            role: "admin"
          };

          User.prototype.save.mockResolvedValue(expectedUser);
          await userController.createAccount(mockRequest, mockResponse);

        // Verify the expected behavior of the user creation process
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

