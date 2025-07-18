# 🌐 Webex WebSocket Listener Demo

A browser-based demonstration application that showcases real-time message listening using the Webex JavaScript SDK's WebSocket functionality. This interactive web page allows users to authenticate with Webex, listen for incoming messages across all their rooms, and test the functionality with a dedicated test room.

## ✨ Features

- **🔐 Personal Access Token Authentication** - Simple token-based authentication with Webex
- **📡 Real-time Message Listening** - WebSocket-based message notifications across all user rooms
- **🏠 Test Room Management** - Create and delete dedicated test rooms for demonstration
- **💬 Random Message Generation** - Send fun Unicode emoji messages to test the listener
- **📊 Live Message Display** - Real-time table updates showing incoming message details
- **🎨 Clean UI Design** - Responsive interface using Spectre.css framework
- **📋 Room Information** - Display room details and message metadata
- **🔄 Start/Stop Controls** - Toggle message listening on and off

## 🚀 Quick Start

### Prerequisites

- Modern web browser with WebSocket support
- Valid Webex personal access token
- Active Webex account with room access

### Setup and Usage

1. **Access the Application:**
   - Open `index.html` in a web browser
   - Or deploy to a web server (GitHub Pages, local server, etc.)

2. **Authenticate:**
   - Get your personal access token from [Webex Developer Portal](https://developer.webex.com/docs/api/getting-started)
   - Enter the token in the authentication field
   - Click "Authenticate" to verify your credentials

3. **Start Listening:**
   - Click "Start Listening to Messages" to activate the WebSocket listener
   - The status will update to show active listening state

4. **Test with Demo Room:**
   - Click "Create Test Room" to create a dedicated testing space
   - Use "Send a Message to Your Test Room" to trigger notifications
   - Watch the message table update in real-time

5. **Monitor Activity:**
   - Send messages from any Webex client to your rooms
   - Observe real-time updates in the "Last message" table
   - View sender, room, timestamp, and content information

## 📖 How It Works

### WebSocket Integration

The application uses the Webex JavaScript SDK's WebSocket functionality to establish a persistent connection for real-time message notifications:

```javascript
// Start listening for messages
webex.messages.listen().then(() => {
    // WebSocket connection established
    listening = true;
    
    // Register event handler for new messages
    webex.messages.on('created', (event) => {
        // Handle incoming message
        console.log('Message received:', event.data);
    });
});
```

### Authentication Flow

```javascript
// Initialize Webex SDK with personal access token
function initialize() {
    webex = Webex.init({
        credentials: {
            access_token: document.getElementById('access-token').value
        }
    });
}

// Verify token by calling /people/me endpoint
webex.people.get('me').then(person => {
    // Authentication successful
    tokenHolder = person;
    // Enable additional features
}).catch(reason => {
    // Authentication failed
    console.error('Authentication failed:', reason);
});
```

### Message Event Handling

```javascript
webex.messages.on('created', (event) => {
    // Extract message details
    const messageData = event.data;
    const senderId = event.actorId;
    
    // Get sender information
    webex.people.get(senderId).then(sender => {
        // Get room information
        webex.rooms.get(messageData.roomId).then(room => {
            // Update UI with message details
            updateMessageDisplay(room, messageData, sender);
        });
    });
});
```

## 🏗️ Project Structure

```
websocket-demo-page/
├── index.html              # Main HTML interface
├── app.js                  # Application logic and WebSocket handling
├── bundle.js               # Bundled Webex JavaScript SDK
├── _config.yml             # Jekyll configuration for GitHub Pages
├── LICENSE                 # Cisco Sample Code License
└── README.md               # This documentation
```

### Core Components

| Component | Description | Purpose |
|-----------|-------------|---------|
| **HTML Interface** | User interface with forms and tables | [`index.html`](index.html) |
| **WebSocket Logic** | Message listening and event handling | [`app.js`](app.js) |
| **Webex SDK Bundle** | Pre-bundled Webex JavaScript SDK | [`bundle.js`](bundle.js) |
| **Jekyll Config** | GitHub Pages deployment configuration | [`_config.yml`](_config.yml) |

## 🔧 Code Implementation

### Global Variables

```javascript
let testRoom;        // Test room object for demonstrations
let webex;           // Webex SDK instance
let tokenHolder;     // Authenticated user information
let listening;       // WebSocket listener status
```

### Core Functions

| Function | Description | Usage |
|----------|-------------|-------|
| **initialize()** | Creates Webex SDK instance with token | Called during authentication |
| **listenToMessages()** | Starts WebSocket listener | Activated by "Start Listening" button |
| **stopListeningToMessages()** | Deactivates WebSocket listener | Activated by "Stop Listening" button |
| **createRoom()** | Creates test room for demonstrations | Activated by "Create Test Room" button |
| **clearRoom()** | Deletes the test room | Activated by "Delete Test Room" button |

### UI Event Handlers

```javascript
// Authentication form submission
document.getElementById('authenticate').addEventListener('submit', ev => {
    ev.preventDefault();
    initialize();
    // Verify token and enable features
});

// Start/stop message listening
document.getElementById('listener-btn').addEventListener('click', event => {
    event.preventDefault();
    if (!listening) {
        listenToMessages();
    } else {
        stopListeningToMessages();
    }
});

// Test room management
document.getElementById('room-btn').addEventListener('click', event => {
    event.preventDefault();
    if (testRoom) {
        clearRoom();
    } else {
        createRoom();
    }
});
```

### Random Message Generation

```javascript
// Fun emoji messages for testing
const messages = ['ʕ·͡ᴥ·ʔ', '(っ◕‿◕)っ', '(⌐■_■)', '\\m/_(>_<)_\\m/', 'ᕙ(⇀‸↼)ᕗ', '[¬º-°]¬'];

// Send random message to test room
document.getElementById('messages-btn').addEventListener('click', event => {
    event.preventDefault();
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    webex.messages.create({
        roomId: testRoom.id,
        markdown: message
    });
});
```

## 🎨 User Interface

### Layout Structure

The interface is built with a responsive design using Spectre.css:

1. **Header Section:**
   - Title: "Websocket Listener"
   - Description of functionality
   - Link to source code

2. **Authentication Section:**
   - Personal access token input field
   - Authentication button
   - Status indicators

3. **Control Section:**
   - Start/Stop listening button
   - Create/Delete test room button
   - Send test message button

4. **Information Tables:**
   - Test room details table
   - Last message information table

### Status Indicators

```css
/* Status label styling */
.label-success { background-color: #32b643; }
.label-warning { background-color: #ffb700; }
.label-error { background-color: #e85600; }
```

### Table Styling

```css
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}

th, td {
    padding: 5px;
}
```

## ⚙️ Configuration

### Personal Access Token

1. **Obtain Token:**
   - Visit [Webex Developer Portal](https://developer.webex.com/docs/api/getting-started)
   - Log in with your Webex account
   - Copy your personal access token (12-hour validity)

2. **Token Usage:**
   ```javascript
   webex = Webex.init({
       credentials: {
           access_token: 'YOUR_PERSONAL_ACCESS_TOKEN'
       }
   });
   ```

### WebSocket Configuration

The WebSocket connection is automatically configured by the Webex SDK:

```javascript
// Start listening (establishes WebSocket)
webex.messages.listen().then(() => {
    console.log('WebSocket connection established');
});

// Stop listening (closes WebSocket)
webex.messages.stopListening();
webex.messages.off('created');
```

## 🧪 Testing the Demo

### Step-by-Step Testing

1. **Authentication Test:**
   ```bash
   # Expected: Green success message with your display name
   1. Enter valid access token
   2. Click "Authenticate"
   3. Verify "authenticated as [Your Name]" appears
   ```

2. **WebSocket Listener Test:**
   ```bash
   # Expected: Blue warning changing to green success
   1. Click "Start Listening to Messages"
   2. Verify status changes to "listening to messages"
   3. Button text changes to "Stop Listening to Messages"
   ```

3. **Test Room Creation:**
   ```bash
   # Expected: Table appears with room details
   1. Click "Create Test Room"
   2. Verify room details table appears
   3. "Send a Message" button becomes visible
   ```

4. **Message Testing:**
   ```bash
   # Expected: Real-time message table updates
   1. Click "Send a Message to Your Test Room"
   2. Verify "Last message" table updates
   3. Check timestamp and emoji content
   ```

5. **External Message Test:**
   ```bash
   # Expected: Table updates for any room activity
   1. Send message from Webex mobile/desktop app
   2. Verify message appears in demo table
   3. Check sender and room information
   ```

### Debug Console

Monitor browser console for additional information:

```javascript
// Message reception logging
console.log('message received');

// Error handling
console.error('Could not get room details:', reason.message);
console.error('Authentication failed:', reason.message);
```

## 🌐 Deployment Options

### GitHub Pages

The repository includes Jekyll configuration for GitHub Pages:

```yaml
# _config.yml
theme: jekyll-theme-minimal
```

### Local Development

```bash
# Simple HTTP server
python -m http.server 8000
# or
npx http-server

# Access at http://localhost:8000
```

### Static Hosting

Deploy to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

## 🔐 Security Considerations

### Token Management

- **Personal Access Tokens:** 12-hour expiration, suitable for testing
- **Production Use:** Consider OAuth integration for longer-term access
- **Client-Side Storage:** Tokens are stored in browser memory only

### WebSocket Security

```javascript
// WebSocket connections are secured by Webex infrastructure
// No additional client-side security configuration required
```

### CORS and CSP

For production deployment, consider:

```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' https://webexapis.com https://unpkg.com;">
```

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Authentication Failed** | Verify token validity and expiration |
| **WebSocket Not Starting** | Check browser WebSocket support and network connectivity |
| **Messages Not Appearing** | Ensure rooms are accessible and listener is active |
| **UI Not Updating** | Check browser console for JavaScript errors |

### Debug Steps

1. **Check Browser Console:**
   ```javascript
   // Look for error messages
   console.error('Authentication failed:', reason);
   console.error('Could not start listener:', error.message);
   ```

2. **Verify Network Connectivity:**
   ```bash
   # Test API access
   curl -H "Authorization: Bearer YOUR_TOKEN" https://webexapis.com/v1/people/me
   ```

3. **Test WebSocket Support:**
   ```javascript
   // Check WebSocket availability
   if ('WebSocket' in window) {
       console.log('WebSocket supported');
   } else {
       console.log('WebSocket not supported');
   }
   ```

### Browser Compatibility

| Browser | Version | WebSocket Support |
|---------|---------|-------------------|
| Chrome | 16+ | ✅ Full Support |
| Firefox | 11+ | ✅ Full Support |
| Safari | 7+ | ✅ Full Support |
| Edge | 12+ | ✅ Full Support |

## 📚 Educational Value

### Learning Objectives

This demo teaches:

1. **WebSocket Integration:** Real-time communication patterns
2. **Webex SDK Usage:** Authentication and API interaction
3. **Event-Driven Programming:** Handling asynchronous events
4. **DOM Manipulation:** Dynamic UI updates
5. **Error Handling:** Graceful failure management

### Extension Ideas

```javascript
// Add more event types
webex.rooms.on('created', handleRoomCreated);
webex.rooms.on('updated', handleRoomUpdated);

// Message filtering
webex.messages.on('created', (event) => {
    if (event.data.text.includes('@me')) {
        handleMention(event);
    }
});

// Multiple room monitoring
const roomSubscriptions = new Map();
rooms.forEach(room => {
    roomSubscriptions.set(room.id, subscribeToRoom(room));
});
```

## 🤝 Contributing

Suggestions for enhancing this demo:

1. **Message Filtering:** Add keyword filtering for messages
2. **Room Selection:** Choose specific rooms to monitor
3. **Message History:** Display recent message history
4. **File Attachments:** Handle and display file messages
5. **Mentions Detection:** Highlight messages mentioning the user

## 📄 License

This project is licensed under the Cisco Sample Code License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support and questions:

- **WebSocket Issues**: [Webex JavaScript SDK Documentation](https://webex.github.io/webex-js-sdk/)
- **API Questions**: [Webex Developer Portal](https://developer.webex.com)
- **Community**: [Webex Developer Community](https://developer.webex.com/community)

## Thanks!

Made with ❤️ by the Webex Developer Relations Team at Cisco

---

**Note**: This demo uses personal access tokens for simplicity. For production applications, implement proper OAuth flows and consider security best practices for token management.
