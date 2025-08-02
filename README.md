# Civitas - Decentralized Social Media Platform

Civitas is a decentralized social media platform built using the **Internet Computer Protocol (ICP)**. The platform allows users to create posts with content and file attachments, like posts, and add comments - all running on blockchain technology.

![Civitas Logo](logo.png)

## Features

- **Decentralized Backend**: Powered by ICP's canister smart contracts
- **User Authentication**: Internet Identity integration for secure login
- **Post Creation**: Create posts with text content and file URLs
- **Social Interactions**: Like posts and add comments
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Dynamic post feed with instant interactions

## Technology Stack

### Backend
- **ICP (Internet Computer Protocol)**: Decentralized blockchain infrastructure
- **Motoko**: Native programming language for ICP canisters
- **DFX**: Development framework for ICP

### Frontend
- **React.js**: Modern JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **@dfinity/agent**: ICP JavaScript agent for frontend-backend communication
- **@dfinity/auth-client**: Authentication client for Internet Identity

## Prerequisites

Before running this project, you need to install the following:

### 1. Install DFX CLI
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

Verify installation:
```bash
dfx --version
```

### 2. Install Node.js and npm
Download and install from [nodejs.org](https://nodejs.org/en)

Verify installation:
```bash
node --version
npm --version
```

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/civitas.git
cd civitas
```

### 2. Install Frontend Dependencies
```bash
cd src/civitas_frontend
npm install
```

### 3. Start Local Internet Computer
```bash
# From the project root directory
dfx start --background
```

### 4. Deploy the Backend Canister
```bash
# From the project root directory
dfx deploy civitas_backend
```

### 5. Start the Frontend Development Server
```bash
# From src/civitas_frontend directory
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
civitas/
├── dfx.json                 # DFX configuration
├── src/
│   ├── civitas_backend/
│   │   └── main.mo         # Motoko backend canister
│   └── civitas_frontend/
│       ├── package.json    # Frontend dependencies
│       ├── public/         # Static assets
│       └── src/
│           ├── App.js      # Main React component
│           ├── index.js    # React entry point
│           └── index.css   # Tailwind CSS styles
├── data.json              # Sample data (legacy)
└── README.md
```

## Development Workflow

### Backend Development
1. Make changes to `src/civitas_backend/main.mo`
2. Deploy changes: `dfx deploy civitas_backend`
3. The canister will be updated automatically

### Frontend Development
1. Make changes to React components in `src/civitas_frontend/src/`
2. The development server will hot-reload automatically
3. For production build: `npm run build`

## API Reference

### Backend Canister Methods

- `createPost(content: Text, fileUrl: Text)`: Create a new post
- `getPosts()`: Retrieve all posts
- `likePost(postId: Nat)`: Like a specific post
- `addComment(postId: Nat, text: Text)`: Add a comment to a post
- `getPost(postId: Nat)`: Get a specific post by ID
- `getPostsByAuthor(author: Principal)`: Get posts by a specific author

## Deployment

### Local Development
- Backend: `dfx deploy civitas_backend`
- Frontend: `npm start` (runs on localhost:3000)

### Production Deployment
1. Build the frontend: `npm run build`
2. Deploy to ICP mainnet: `dfx deploy --network ic`

## Troubleshooting

### Common Issues

1. **DFX not found**: Make sure DFX is installed and in your PATH
2. **Canister deployment fails**: Check if the local IC is running (`dfx start`)
3. **Frontend can't connect to backend**: Verify the canister ID in the frontend code
4. **Authentication issues**: Ensure Internet Identity is properly configured

### Useful Commands

```bash
# Check DFX status
dfx ping

# List deployed canisters
dfx canister status

# View canister logs
dfx canister call civitas_backend getPosts

# Reset local environment
dfx stop
dfx start --clean
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the [ICP documentation](https://internetcomputer.org/docs)
- Join the [ICP community](https://forum.dfinity.org/)

---

**Note**: This is an MVP (Minimum Viable Product) version. Future enhancements may include user profiles, post categories, advanced search, and more social features.




