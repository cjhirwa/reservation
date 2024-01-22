
import request from "supertest";
import app from '../index';
let token;
var id;
describe('\ntesting users routes', () => {
    jest.setTimeout(15000);
    describe('Testing user registration', () => {
        test('should return the user who created account', async () => {
            const res = await request(app).post('/user').send({
                firstName:"Nambaje",
                lastName:"Edwin",
                password:"123@Pass",
                email:` john.doe.${Math.random()}@example.com`,
                role:"admin"
            })
            expect(res.statusCode).toBe(200)
            expect(typeof res.body).toBe('object')
        })
        
        test('should return 401 for entering bad request', async () => {
            const res = await request(app).post('/user').send({
                firstName: "NEW1",
                password: "Test@123"
            })
            expect(res.statusCode).toBe(401)
        })
    })
    describe('testing user routes', () => {
        test('should return the token of user who logged account', async () => {
            const res = await request(app).post('/login').send({
                email: "nambajeeedwin@gmail.com",
                password:"123@Pass",
            })
            token=res.body.token
            id = res.body._id;
            expect(res.statusCode).toBe(200)
            expect(typeof res.body).toBe('object')
        })
        test('should return 400 for entering unexist email', async () => {
             const res = await request(app).post('/login').send({
                email: "emailnotin@test.com",
                 password: "Test@123"
                })
            expect(res.statusCode).toBe(400)
            expect(typeof res.body).toBe('object')
       })
       test('should return all users', async()=>{
        const res=await request(app).get('/users')
        .set('token',`Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        })
        test("should return a single user",async()=>{
            const res=await request(app).get(`/user/${id}`)
            .set('token',`Bearer ${token}`)
            expect(res.statusCode).toBe(200)
        })
       })
}) 