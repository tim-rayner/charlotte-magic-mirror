# MMM-Remote-Control Documentation

## Overview

MMM-Remote-Control is a powerful module for MagicMirror² that provides web-based remote control functionality. It allows you to control your Magic Mirror from any device on your network through a web interface or API.

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Access Methods](#access-methods)
3. [Default Controls](#default-controls)
4. [API Integration](#api-integration)
5. [Web App Development](#web-app-development)
6. [Troubleshooting](#troubleshooting)

## Setup & Configuration

### Prerequisites

- MagicMirror² installed and running
- Network access configured
- MMM-Remote-Control module installed

### Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/Jopyth/MMM-Remote-Control.git
cd MMM-Remote-Control
npm install
```

### Configuration

Add the following to your `config.js`:

```javascript
{
  module: "MMM-Remote-Control",
  config: {
    address: "0.0.0.0",
    port: 8080,
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.1.0/24"],
    showModuleApiMenu: true,
    secureEndpoints: true
  }
}
```

### Network Configuration

Ensure your main MagicMirror configuration allows network access:

```javascript
let config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.1.0/24"]
  // ... rest of config
};
```

## Access Methods

### 1. Web Interface

**URL**: `http://[YOUR_PI_IP]:8080/remote.html`

**Example**: `http://192.168.1.80:8080/remote.html`

**Features**:

- Module show/hide controls
- Brightness adjustment
- System controls (restart, refresh, update)
- Notification system
- Custom menu items

### 2. Direct API Access

**Base URL**: `http://[YOUR_PI_IP]:8080/api/`

**Available Endpoints**:

- `GET /api/modules` - List all modules
- `POST /api/modules/{action}` - Control modules
- `POST /api/system/{action}` - System controls
- `POST /api/notifications` - Send notifications

### 3. Socket.IO Integration

The module uses Socket.IO for real-time communication:

```javascript
// Connect to the MagicMirror socket
const socket = io("http://192.168.1.80:8080");

// Send remote actions
socket.emit("REMOTE_ACTION", {
  action: "HIDE",
  module: "clock"
});
```

## Default Controls

### Module Controls

| Action   | Description              | Example                                  |
| -------- | ------------------------ | ---------------------------------------- |
| `HIDE`   | Hide a module            | `{action: 'HIDE', module: 'clock'}`      |
| `SHOW`   | Show a module            | `{action: 'SHOW', module: 'weather'}`    |
| `TOGGLE` | Toggle module visibility | `{action: 'TOGGLE', module: 'newsfeed'}` |
| `FORCE`  | Force show a module      | `{action: 'FORCE', module: 'alert'}`     |

### System Controls

| Action    | Description                    | Example               |
| --------- | ------------------------------ | --------------------- |
| `RESTART` | Restart MagicMirror            | `{action: 'RESTART'}` |
| `REFRESH` | Refresh the mirror page        | `{action: 'REFRESH'}` |
| `UPDATE`  | Update MagicMirror and modules | `{action: 'UPDATE'}`  |
| `SAVE`    | Save current configuration     | `{action: 'SAVE'}`    |

### Brightness Control

```javascript
{
  action: 'BRIGHTNESS',
  value: 100  // 10-200 range, 100 = default
}
```

### Monitor Controls

| Action          | Description        |
| --------------- | ------------------ |
| `MONITORON`     | Turn on monitor    |
| `MONITOROFF`    | Turn off monitor   |
| `MONITORSTATUS` | Get monitor status |

### Alert & Notification Controls

```javascript
// Show alert
{
  action: 'SHOW_ALERT',
  content: 'Hello World!'
}

// Send notification to all modules
{
  action: 'NOTIFICATION',
  notification: 'CUSTOM_NOTIFICATION',
  payload: {message: 'Custom message'}
}
```

## API Integration

### REST API Endpoints

#### Get Module Information

```bash
curl -X GET "http://192.168.1.80:8080/api/modules"
```

**Response**:

```json
{
  "moduleData": [
    {
      "hidden": false,
      "name": "clock",
      "identifier": "module_1_clock",
      "position": "top_right"
    },
    {
      "hidden": true,
      "name": "weather",
      "identifier": "module_2_weather",
      "position": "top_left"
    }
  ],
  "brightness": 100,
  "settingsVersion": 1
}
```

#### Control Modules

```bash
# Hide a module
curl -X POST "http://192.168.1.80:8080/api/modules" \
  -H "Content-Type: application/json" \
  -d '{"action": "HIDE", "module": "clock"}'

# Show a module
curl -X POST "http://192.168.1.80:8080/api/modules" \
  -H "Content-Type: application/json" \
  -d '{"action": "SHOW", "module": "weather"}'
```

#### System Controls

```bash
# Restart MagicMirror
curl -X POST "http://192.168.1.80:8080/api/system" \
  -H "Content-Type: application/json" \
  -d '{"action": "RESTART"}'

# Adjust brightness
curl -X POST "http://192.168.1.80:8080/api/system" \
  -H "Content-Type: application/json" \
  -d '{"action": "BRIGHTNESS", "value": 150}'
```

### JavaScript Integration

#### Basic Socket.IO Client

```javascript
// Connect to MagicMirror
const socket = io("http://192.168.1.80:8080");

// Listen for module updates
socket.on("MODULE_DATA", (data) => {
  console.log("Module data updated:", data);
});

// Send remote actions
function hideModule(moduleName) {
  socket.emit("REMOTE_ACTION", {
    action: "HIDE",
    module: moduleName
  });
}

function showModule(moduleName) {
  socket.emit("REMOTE_ACTION", {
    action: "SHOW",
    module: moduleName
  });
}

function setBrightness(value) {
  socket.emit("REMOTE_ACTION", {
    action: "BRIGHTNESS",
    value: value
  });
}
```

#### Fetch API Integration

```javascript
class MagicMirrorController {
  constructor(baseUrl = "http://192.168.1.80:8080") {
    this.baseUrl = baseUrl;
  }

  async getModules() {
    const response = await fetch(`${this.baseUrl}/api/modules`);
    return await response.json();
  }

  async controlModule(action, module) {
    const response = await fetch(`${this.baseUrl}/api/modules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action, module })
    });
    return await response.json();
  }

  async systemControl(action, value = null) {
    const payload = { action };
    if (value !== null) payload.value = value;

    const response = await fetch(`${this.baseUrl}/api/system`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  }
}

// Usage
const mm = new MagicMirrorController();
mm.controlModule("HIDE", "clock");
mm.systemControl("BRIGHTNESS", 150);
```

## Web App Development

### Project Structure

```
magic-mirror-webapp/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── app.js
│   ├── mm-controller.js
│   └── ui-components.js
└── assets/
    └── icons/
```

### Basic HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Magic Mirror Control</title>
    <link rel="stylesheet" href="styles/main.css" />
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Magic Mirror Control</h1>
        <div class="connection-status" id="connectionStatus">
          <span class="status-dot"></span>
          <span class="status-text">Connecting...</span>
        </div>
      </header>

      <main>
        <section class="modules-section">
          <h2>Modules</h2>
          <div class="modules-grid" id="modulesGrid">
            <!-- Modules will be populated here -->
          </div>
        </section>

        <section class="controls-section">
          <h2>Controls</h2>
          <div class="control-buttons">
            <button onclick="mm.systemControl('RESTART')">Restart</button>
            <button onclick="mm.systemControl('REFRESH')">Refresh</button>
            <button onclick="mm.systemControl('UPDATE')">Update</button>
          </div>

          <div class="brightness-control">
            <label for="brightness"
              >Brightness: <span id="brightnessValue">100</span>%</label
            >
            <input
              type="range"
              id="brightness"
              min="10"
              max="200"
              value="100"
              oninput="updateBrightness(this.value)"
            />
          </div>
        </section>
      </main>
    </div>

    <script src="scripts/mm-controller.js"></script>
    <script src="scripts/app.js"></script>
  </body>
</html>
```

### CSS Styling

```css
/* styles/main.css */
:root {
  --primary-color: #2196f3;
  --secondary-color: #ff9800;
  --success-color: #4caf50;
  --danger-color: #f44336;
  --background-color: #f5f5f5;
  --card-background: #ffffff;
  --text-color: #333333;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--card-background);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  transition: background-color 0.3s ease;
}

.status-dot.connected {
  background-color: var(--success-color);
}

.status-dot.disconnected {
  background-color: var(--danger-color);
}

.modules-section,
.controls-section {
  background: var(--card-background);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.module-card {
  background: var(--background-color);
  border-radius: 8px;
  padding: 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.module-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.module-card.hidden {
  opacity: 0.5;
  border-color: var(--danger-color);
}

.module-card.visible {
  border-color: var(--success-color);
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #1976d2;
}

.brightness-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}
```

### JavaScript Implementation

```javascript
// scripts/mm-controller.js
class MagicMirrorController {
  constructor(baseUrl = "http://192.168.1.80:8080") {
    this.baseUrl = baseUrl;
    this.socket = null;
    this.modules = [];
    this.isConnected = false;
    this.init();
  }

  init() {
    this.connectSocket();
    this.setupEventListeners();
  }

  connectSocket() {
    this.socket = io(this.baseUrl);

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      this.loadModules();
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.updateConnectionStatus(false);
    });

    this.socket.on("MODULE_DATA", (data) => {
      this.modules = data.moduleData || [];
      this.updateModulesUI();
    });
  }

  setupEventListeners() {
    // Setup any additional event listeners
  }

  updateConnectionStatus(connected) {
    const statusDot = document.querySelector(".status-dot");
    const statusText = document.querySelector(".status-text");

    if (connected) {
      statusDot.className = "status-dot connected";
      statusText.textContent = "Connected";
    } else {
      statusDot.className = "status-dot disconnected";
      statusText.textContent = "Disconnected";
    }
  }

  async loadModules() {
    try {
      const response = await fetch(`${this.baseUrl}/api/modules`);
      const data = await response.json();
      this.modules = data.moduleData || [];
      this.updateModulesUI();
    } catch (error) {
      console.error("Failed to load modules:", error);
    }
  }

  updateModulesUI() {
    const modulesGrid = document.getElementById("modulesGrid");
    modulesGrid.innerHTML = "";

    this.modules.forEach((module) => {
      const moduleCard = this.createModuleCard(module);
      modulesGrid.appendChild(moduleCard);
    });
  }

  createModuleCard(module) {
    const card = document.createElement("div");
    card.className = `module-card ${module.hidden ? "hidden" : "visible"}`;

    card.innerHTML = `
      <h3>${module.name}</h3>
      <p>Position: ${module.position || "default"}</p>
      <p>Status: ${module.hidden ? "Hidden" : "Visible"}</p>
      <div class="module-actions">
        <button onclick="mm.toggleModule('${module.name}')">
          ${module.hidden ? "Show" : "Hide"}
        </button>
      </div>
    `;

    return card;
  }

  async toggleModule(moduleName) {
    const module = this.modules.find((m) => m.name === moduleName);
    if (!module) return;

    const action = module.hidden ? "SHOW" : "HIDE";
    await this.controlModule(action, moduleName);
  }

  async controlModule(action, module) {
    if (!this.isConnected) return;

    this.socket.emit("REMOTE_ACTION", { action, module });
  }

  async systemControl(action, value = null) {
    if (!this.isConnected) return;

    const payload = { action };
    if (value !== null) payload.value = value;

    this.socket.emit("REMOTE_ACTION", payload);
  }

  async setBrightness(value) {
    await this.systemControl("BRIGHTNESS", value);
    document.getElementById("brightnessValue").textContent = value;
  }
}

// scripts/app.js
let mm;

document.addEventListener("DOMContentLoaded", () => {
  mm = new MagicMirrorController();

  // Setup brightness slider
  const brightnessSlider = document.getElementById("brightness");
  brightnessSlider.addEventListener("input", (e) => {
    const value = e.target.value;
    document.getElementById("brightnessValue").textContent = value;
  });

  brightnessSlider.addEventListener("change", (e) => {
    const value = parseInt(e.target.value);
    mm.setBrightness(value);
  });
});

function updateBrightness(value) {
  document.getElementById("brightnessValue").textContent = value;
  mm.setBrightness(parseInt(value));
}
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused

**Symptoms**: "Site refused to connect" error

**Solutions**:

- Verify MagicMirror is running on the Pi
- Check IP address is correct
- Ensure ipWhitelist includes your network range
- Check firewall settings

#### 2. Module Not Found

**Symptoms**: "Could not find main module js file" error

**Solutions**:

- Remove references to non-existent modules from `defaultmodules.js`
- Check module installation
- Verify module names in config

#### 3. API Endpoints Not Working

**Symptoms**: 404 errors on API calls

**Solutions**:

- Ensure MMM-Remote-Control is properly installed
- Check module configuration
- Verify port 8080 is accessible

### Debug Commands

```bash
# Check if MagicMirror is running
ps aux | grep "node.*start"

# Check port usage
lsof -i :8080

# Test network connectivity
ping 192.168.1.80

# Test API endpoint
curl -X GET "http://192.168.1.80:8080/api/modules"
```

### Log Analysis

Check MagicMirror logs for errors:

```bash
# View real-time logs
tail -f ~/MagicMirror/logs/magicmirror.log

# Search for specific errors
grep -i "error" ~/MagicMirror/logs/magicmirror.log
```

## Security Considerations

### Network Security

- **Local Network Only**: Configure ipWhitelist to restrict access to your local network
- **Firewall**: Ensure your router firewall is properly configured
- **VPN**: Consider using VPN for remote access

### API Security

- **Authentication**: Implement API key authentication for production use
- **HTTPS**: Use HTTPS in production environments
- **Rate Limiting**: Implement rate limiting for API endpoints

### Best Practices

1. **Regular Updates**: Keep MagicMirror and modules updated
2. **Backup Configuration**: Regularly backup your config files
3. **Monitor Logs**: Check logs for unusual activity
4. **Limit Access**: Only allow necessary IP ranges

## Additional Resources

- [MMM-Remote-Control GitHub](https://github.com/Jopyth/MMM-Remote-Control)
- [MagicMirror² Documentation](https://docs.magicmirror.builders/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MagicMirror² Forum](https://forum.magicmirror.builders/)

---

_This documentation covers the essential aspects of MMM-Remote-Control setup, usage, and integration. For advanced features and customizations, refer to the official module documentation._
