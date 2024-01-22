import request from 'supertest';
import app from '../index';
import Room from '../src/models/room'

let id,token;
describe('Testing room routes', () => {
    jest.setTimeout(15000);

    beforeAll(async () => {
        await Room.deleteMany();
        jest.setTimeout(15000);
      });

    describe('Creating a room', () => {
        test('should create a new room', async () => {
            const res = await request(app)
                .post('/room/create')
                .send({
                    name: "Sample Roomsss",
                    price: 100,
                    specifications: "Sample specifications",
                    category_id: "659d4dcb43c304dfe06f26b9",
                    image: "sample.jpg"
                });
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
        });

        test('should return an error for invalid room creation request', async () => {
            const res = await request(app)
                .post('/room/create')
                .send();
            expect(res.statusCode).toBe(500);
        });
    });

    describe('Fetching rooms', () => {
        test('should return all rooms', async () => {
            const res = await request(app)
                .get('/rooms');
                id = res.body[0]._id
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('should return a single room by ID', async () => {
            const res = await request(app)
                .get(`/room/${id}`);
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
        });

        test('should return an error for non-existent room ID', async () => {
            const nonExistentRoomId = '659d4dcb43c303dfe06f26b9';
            const res = await request(app)
                .get(`/room/${nonExistentRoomId}`);
            expect(res.statusCode).toBe(404);
        });
    });
    describe('Deleting a room', () => {
        test('should return the token of user who logged account', async () => {
            const res = await request(app).post('/login').send({
                email: "nambajeeedwin@gmail.com",
                password:"123@Pass",
            })
            token=res.body.token
            expect(res.statusCode).toBe(200)
            expect(typeof res.body).toBe('object')
        })
        test('should delete a room', async () => {
            const roomIdToDelete = 'roomIdToDelete123';
            const res = await request(app).delete(`/room/${roomIdToDelete}/delete`)
            .set('token',`Bearer ${token}`)
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
        });
    });
});
