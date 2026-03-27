# Lynx-Beta WebUI - Comprehensive Documentation

## Overview

The Lynx-Beta WebUI is a modern, interactive dashboard for managing the Lynx KernelSU module on Android devices. It provides real-time system monitoring, performance control, and configuration management through a clean, intuitive interface.

## Architecture

### Three-Layer Architecture

The WebUI implements a three-layer architecture for maximum flexibility and compatibility:

**1. Frontend Layer (WebUI)**
- React 19 + Tailwind CSS 4 for modern UI
- Real-time system monitoring with live metrics
- Interactive performance mode controls
- Configuration management interface
- Uses KernelSU npm package APIs for command execution

**2. Backend Layer (tRPC Server)**
- Express.js server with tRPC for type-safe API
- Configuration file management and validation
- Command preparation and execution routing
- Module and device information retrieval
- Notification system for critical events

**3. System Layer (Lxcore + Shell Scripts)**
- Lxcore backend for command execution
- Shell scripts for system operations
- Direct access to /proc and /sys for metrics
- Configuration file synchronization

## Features

### 1. Real-Time System Monitoring
- **CPU Metrics**: Usage, core count, frequencies, governors
- **GPU Metrics**: Frequency, load percentage
- **RAM Metrics**: Total, available, used, percentage
- **Thermal Metrics**: Temperature, throttling status, thermal zones
- **ZRAM Metrics**: Size, usage, algorithm

### 2. Performance Mode Control
- **Auto (AI)**: Intelligent adaptive mode
- **Aggressive**: Maximum performance
- **High Performance**: Gaming optimized
- **Powersave**: Battery efficient

Each mode automatically configures:
- CPU governors and frequencies
- GPU scaling
- RAM management
- I/O scheduling

### 3. Thermal Management
- Enable/disable thermal engine
- Monitor temperature zones
- Throttling status
- Thermal configuration options

### 4. ZRAM Management
- Size selection (1GB to 6GB)
- Algorithm configuration
- Real-time usage monitoring
- Automatic optimization

### 5. Charging Control
- Custom charge limit (50-100%)
- Flow control settings
- Battery health optimization
- Charging behavior customization

### 6. Configuration Management
- Live lynx.conf editor
- Validation and error checking
- Real-time synchronization
- Backup and restore capabilities

### 7. BusyBox Management
- Installation status checker
- Automatic fixer for KernelSU-Next
- Support for both KSU and Magisk
- One-click repair functionality

### 8. CLI/Termux Compatibility
- All WebUI operations accessible via CLI
- Termux UI mode for command-line users
- Feature parity between interfaces
- Consistent command structure

## File Structure

```
lynx-webui/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.tsx          # Main monitoring dashboard
│       │   ├── PerformanceControl.tsx # Mode and thermal control
│       │   ├── SystemConfig.tsx       # ZRAM and charging settings
│       │   └── Home.tsx               # Landing page
│       ├── components/                # Reusable UI components
│       ├── lib/
│       │   └── trpc.ts                # tRPC client setup
│       └── App.tsx                    # Main app router
├── server/
│   ├── lxcore.ts                      # Configuration management
│   ├── routers/
│   │   └── system.ts                  # System API routes
│   └── routers.ts                     # Main router setup
├── drizzle/
│   └── schema.ts                      # Database schema
├── lynx-module/                       # Lynx-Beta module files
└── todo.md                            # Development tracking

```

## Backend API Routes

### System Monitoring
- `system.metrics` - Get real-time system metrics
- `system.moduleInfo` - Get module information
- `system.deviceInfo` - Get device information

### Configuration Management
- `system.readConfig` - Parse configuration file
- `system.prepareConfigUpdate` - Validate and prepare config changes
- `system.preparePerformanceMode` - Prepare mode change
- `system.prepareZramSize` - Prepare ZRAM change
- `system.prepareThermalMode` - Prepare thermal change

### System Operations
- `system.getBusyBoxScript` - Get BusyBox installation script
- `system.parseModuleInfo` - Parse module.prop file
- `system.formatDeviceInfo` - Format device information

## Data Flow

### Configuration Update Flow

```
User Input (WebUI)
    ↓
Validation (Backend)
    ↓
Config Preparation (Backend)
    ↓
File Update (Client via KernelSU)
    ↓
Property Application (resetprop)
    ↓
Confirmation (WebUI)
```

### System Metrics Flow

```
KernelSU exec() API (Client)
    ↓
Read /proc files (Client)
    ↓
Parse Metrics (Client)
    ↓
Send to Backend (tRPC)
    ↓
Format and Display (WebUI)
    ↓
Auto-refresh every 2 seconds
```

## Configuration File (lynx.conf)

The configuration file is located at `/data/adb/modules/Lynx/script/lib/lynx.conf`

### Key Properties

| Property | Values | Description |
|----------|--------|-------------|
| `lynx.mode` | auto, aggressive, high, powersave | Performance mode |
| `lynx.thermal` | 0, 1 | Thermal management |
| `lynx.control` | custom value | Control mode |
| `lynx.cc` | 0-100 | Charge control |
| `lynx.fcc` | custom | Fast charge control |
| `lynx.lcc` | decimal | Charge limit |
| `lynx.ac` | custom | Adaptive control |
| `lynx.max.ac` | 0-100 | Max adaptive control |
| `lynx.min.ac` | 0-100 | Min adaptive control |
| `lynx.flow` | 0, 1 | Flow control |
| `flow.mode` | 0-5 | Flow mode level |

## KernelSU API Integration

The WebUI uses the KernelSU npm package for command execution:

```typescript
import { exec, spawn } from 'kernelsu';

// Execute command
const result = await exec('cat /proc/meminfo');

// Stream output
const proc = spawn('ls', ['-l', '/data']);
proc.stdout.on('data', (data) => {
  console.log(data);
});
```

## BusyBox Installation Fix

The WebUI includes automatic detection and fixing for BusyBox installation issues:

1. **Detection**: Checks `/data/adb/ksu/bin/busybox` and `/data/adb/magisk/busybox`
2. **Installation**: Copies to module directory with proper permissions
3. **Verification**: Confirms installation and symlink creation

## CLI Integration

All WebUI operations can be performed via CLI:

```bash
# Performance mode
Lxcore -cpu apply
Lxcore -gpu apply
Lxcore -ram apply

# ZRAM management
Lxcore -zram set size=2048M
Lxcore -zram disable

# Thermal control
cmd thermalservice override-status 0

# Configuration
resetprop lynx.mode aggressive
```

## Development Guide

### Adding a New Feature

1. **Backend**: Add tRPC procedure in `server/routers/system.ts`
2. **Frontend**: Create React component in `client/src/pages/`
3. **Configuration**: Update `lynx.conf` handling if needed
4. **Testing**: Write vitest tests in `server/*.test.ts`

### Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch
```

### Building

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production
pnpm start
```

## Security Considerations

1. **Root Access**: All operations require root/KernelSU privileges
2. **Configuration Validation**: All config changes are validated before application
3. **Error Handling**: Comprehensive error handling for all operations
4. **Logging**: All actions logged to `/storage/emulated/0/Lynx/Lynx.log`

## Troubleshooting

### WebUI Not Loading
- Check KernelSU version (minimum 10940)
- Verify module installation
- Check device logs: `adb logcat`

### Commands Not Executing
- Verify root access
- Check BusyBox installation
- Review `/storage/emulated/0/Lynx/Lynx.log`

### Configuration Not Applying
- Verify file permissions
- Check resetprop availability
- Review configuration syntax

### Metrics Not Updating
- Check /proc file access
- Verify KernelSU permissions
- Review system logs

## Performance Optimization

### Frontend
- React 19 with automatic batching
- Tailwind CSS 4 with JIT compilation
- Optimistic UI updates
- Efficient re-rendering with memoization

### Backend
- tRPC with superjson for efficient serialization
- Database queries optimized with Drizzle ORM
- Caching for frequently accessed data
- Connection pooling for database

### System
- Minimal overhead from monitoring
- Efficient /proc file reading
- Batch configuration updates
- Optimized command execution

## Future Enhancements

- [ ] LLM integration for AI recommendations
- [ ] Advanced analytics dashboard
- [ ] Scheduled task automation
- [ ] Multi-device management
- [ ] Cloud synchronization
- [ ] Custom profile creation
- [ ] Performance benchmarking
- [ ] System event logging and analysis

## Support and Contribution

For issues, feature requests, or contributions, please visit the GitHub repository:
- Repository: https://github.com/Zy0x/Lynx-Beta
- Issues: Report bugs and request features
- Discussions: Community support and ideas

## License

This project is licensed under the Apache License 2.0. See LICENSE file for details.

## Credits

- **Lynx-Beta Module**: Zy0x
- **KernelSU**: tiann
- **WebUI Framework**: React, Tailwind CSS, tRPC
- **UI Components**: shadcn/ui

---

**Last Updated**: March 27, 2026
**Version**: 1.0.0
