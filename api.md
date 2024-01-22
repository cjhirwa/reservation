Functionalities to be tested in API testing:

# Test Room Endpoints (`GET /rooms`):

- Ensures that the endpoint for retrieving rooms (`/rooms`) returns a status code of 200 (OK).
- Verifies that the response does not contain an error field.
- Checks that the response body is an array and has a non-zero length, indicating the presence of rooms.

# Test User Endpoints for Unauthorized Access (`GET /users`):

- Tests that the `/users` endpoint is protected from unauthorized users by checking the response type as a string.
- Attempts to access a specific user (`/user/659aae41f1fc8f1ef419bee7`) and checks that the response type is also a string.

# Test Unsuccessful Login (`POST /login`):

- Attempts to log in with incorrect credentials (incorrect password) and verifies that the response does not contain a token.

# Test Successful Login (`POST /login`):

- Logs in with correct credentials and obtains a token.
- Uses the obtained token to make authorized requests to the `/users` endpoint, ensuring a status code of 200.
- Uses the token to retrieve information about a specific user (`/user/659aae41f1fc8f1ef419bee7`) and checks that the response body is an object.
