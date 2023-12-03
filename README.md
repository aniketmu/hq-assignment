# Admin Dashboard

This is a simple React application for managing user data with features like searching, editing, and deleting multiple rows. The app fetches user data from an external API, allows you to perform various actions on the data, and displays it in a paginated table.

## Features

- **Search**: Search users by name, email, or role.

- **Pagination**: Navigate through the user data with pagination.

- **Edit**: Edit user information directly in the table. You can edit a user by selecting the checkbox against the corresponding user row and then clicking the "Edit" button.

- **Delete**: Delete single or multiple selected users.

## Usage

1. Clone the repository to your local machine.

2. Navigate to the project directory.

3. Install dependencies using `npm install`.

4. Start the application using `npm start`.

5. Open the app in your web browser by visiting `http://localhost:3000`.

## Technologies Used

- React JS
- CSS for styling

## API Endpoint

The user data is fetched from the following API endpoint:

- https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json
