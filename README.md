# Steps to run this applications Locally
1. Download or clone this repo into your local folder.
2. Install all the required dependencies. Use this command
   `
    npm install
   `
3. ` cd server ` 
4. ` npm start ` to start application.
5. Open Postman
6. Use following API operations.

 
| Description                            | Method | API endpoint       | req.body                                                  | Response                                     |
| -------------------------------------- | ------ | ------------------ | --------------------------------------------------------- | -------------------------------------------- |
| Create a new User ( user one )         | POST   | /api/auth/signup   | `{ "name": "User One", "email": "user.one@mail.com", "password": "123", "confirmPassword": "123" }` | `{ "success": true, "message": "User created successfully." }` |
| Create a new User (user two )          | POST   | /api/auth/signup   | `{ "name": "User Two", "email": "user.two@mail.com", "password": "456", "confirmPassword": "456" }` | `{ "success": true, "message": "User created successfully." }` |
| Login User                             | POST   | /api/auth/login    | `{ "email": "user.one@mail.com", "password": "123" }`     | `{ "success": true, "token": "user":user }`        |
| get all notes of auth'd User           | GET | /api/notes   |                        | `{ "success": true, "message": "Notes fetched successfully." }` |
| get a single note of auth'd User by note ID  | GET | /api/notes/:noteId  |                        | `{ "success": true, "message": "Note fetched successfully." }` |
| Create a note for auth'd User          | POST    | /api/notes  | `{ "title":"title one", "content":"content one"}`     | `{ "success": true, "message": "Note created successfully." },note` |
| Update a note for auth'd user          | PUT     | /api/notes/:id     | `{ "title":"update title","content":"update content" }`     |    `{ success:true,message:"Note update sucessfully"  }`           |
| delete a note for auth'd user          | DELETE  | /api/notes/:id     |      |    `{ success:true, message:"Note deleted successfully"     }`     |
| Share a note                           | POST    | /api/notes/:id/share     | `{"recipientEmail":"user.two@mail.com"}`     |`{  success:true, message:"Note shared successfully"    }`  |
| Search for note(s) for Auth's user     | GET     | /api/search        | `Query params q=keyword`     | `{success:true, data}`     |
| Delete User                            | DELETE | /api/auth/delete   | `{ "email": "user.one@mail.com" }`                         | `{ "success": true, "message": "User deleted successfully." }` |


