# Lynx-Beta WebUI Integration Guide

## Overview

This guide explains how to integrate the new Lynx-Beta WebUI with the existing Lynx module installation scripts and runtime environment.

## Architecture

The WebUI is designed as a companion to the Lynx module, providing a modern interface for system monitoring and control while maintaining full compatibility with existing CLI tools and Lxcore backend.

### Components

1. **Frontend (React + Tailwind CSS)**
   - Modern dashboard with real-time metrics
   - Performance mode controls
   - Thermal and ZRAM management
   - Configuration editor

2. **Backend (Express + tRPC)**
   - Type-safe API routes
   - Configuration management
   - System information retrieval
   - Command preparation and execution

3. **Module Integration**
   - Lxcore backend commands
   - Configuration file synchronization
   - KernelSU API integration

## Installation

### Prerequisites

- KernelSU 10940+ (kernel) and 11425+ (ksud)
- Node.js 22.13.0+
- pnpm 10.4.1+

### Setup Steps

1. **Install WebUI Dependencies**
```bash
cd webui
pnpm install
```

2. **Build for Production**
```bash
pnpm build
```

3. **Start Development Server**
```bash
pnpm dev
```

4. **Access WebUI**
- Development: http://localhost:3000
- Production: Deploy to your web server

## Integration with Lynx Module

### 1. Configuration File Synchronization

The WebUI reads and writes to `/data/adb/modules/Lynx/script/lib/lynx.conf`

**Key Properties:**
- `lynx.mode` - Performance mode (auto, aggressive, high, powersave)
- `lynx.thermal` - Thermal management (0/1)
- `lynx.cc` - Charge control
- `lynx.flow` - Flow control
- `zram.size` - ZRAM size configuration

### 2. Lxcore Command Execution

The WebUI uses Lxcore commands for system operations:

```bash
# Performance modes
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

### 3. BusyBox Integration

The WebUI includes automatic BusyBox installation detection and fixing:

- Checks `/data/adb/ksu/bin/busybox` (KSU built-in)
- Falls back to `/data/adb/magisk/busybox` (Magisk)
- Installs to `/data/adb/modules/Lynx/system/xbin/busybox`

### 4. System Metrics Collection

The WebUI collects metrics from:
- `/proc/cpuinfo` - CPU information
- `/proc/meminfo` - Memory information
- `/sys/devices/system/cpu/` - CPU frequencies and governors
- `/sys/class/thermal/` - Thermal zones
- `/sys/block/zram0/` - ZRAM status

## API Routes

### System Monitoring
- `GET /api/trpc/system.metrics` - Real-time system metrics
- `GET /api/trpc/system.moduleInfo` - Module information
- `GET /api/trpc/system.deviceInfo` - Device information

### Configuration Management
- `POST /api/trpc/system.readConfig` - Read configuration
- `POST /api/trpc/system.prepareConfigUpdate` - Prepare config change
- `POST /api/trpc/system.preparePerformanceMode` - Prepare mode change
- `POST /api/trpc/system.prepareZramSize` - Prepare ZRAM change
- `POST /api/trpc/system.prepareThermalMode` - Prepare thermal change

### System Operations
- `GET /api/trpc/system.getBusyBoxScript` - Get installation script
- `POST /api/trpc/system.parseModuleInfo` - Parse module.prop
- `POST /api/trpc/system.formatDeviceInfo` - Format device info

## CLI Integration

All WebUI operations are accessible via CLI:

```bash
# Check current mode
getprop lynx.mode

# Change performance mode
resetprop lynx.mode aggressive
Lxcore -cpu apply

# Set ZRAM size
Lxcore -zram set size=2048M

# Enable thermal management
resetprop lynx.thermal 1
cmd thermalservice override-status 0

# Check BusyBox
ls -la /data/adb/ksu/bin/busybox
```

## Troubleshooting

### WebUI Not Loading
1. Verify KernelSU installation: `getprop ro.kernelsu.version`
2. Check module installation: `ls /data/adb/modules/Lynx`
3. Review logs: `adb logcat | grep -i lynx`

### Configuration Not Applying
1. Verify file permissions: `ls -la /data/adb/modules/Lynx/script/lib/lynx.conf`
2. Check resetprop availability: `which resetprop`
3. Review Lxcore logs: `cat /storage/emulated/0/Lynx/Lynx.log`

### Metrics Not Updating
1. Verify /proc access: `cat /proc/meminfo`
2. Check thermal zones: `ls /sys/class/thermal/`
3. Review system logs: `dmesg | tail -20`

### BusyBox Installation Failed
1. Check KSU busybox: `ls -la /data/adb/ksu/bin/busybox`
2. Check Magisk busybox: `ls -la /data/adb/magisk/busybox`
3. Verify module directory: `ls -la /data/adb/modules/Lynx/system/xbin/`

## Performance Optimization

### Frontend
- React 19 automatic batching
- Tailwind CSS 4 JIT compilation
- Optimistic UI updates
- Efficient re-rendering

### Backend
- tRPC with superjson serialization
- Database connection pooling
- Configuration caching
- Batch command execution

### System
- Minimal monitoring overhead
- Efficient /proc file reading
- Optimized command execution
- Smart configuration updates

## Security Considerations

1. **Root Access**: All operations require KernelSU root privileges
2. **Validation**: All configuration changes are validated before application
3. **Logging**: All actions logged to `/storage/emulated/0/Lynx/Lynx.log`
4. **Error Handling**: Comprehensive error handling for all operations

## Future Enhancements

- [ ] LLM integration for AI recommendations
- [ ] Advanced analytics dashboard
- [ ] Scheduled task automation
- [ ] Multi-device management
- [ ] Cloud synchronization
- [ ] Custom profile creation
- [ ] Performance benchmarking
- [ ] System event logging

## Support

For issues or questions:
1. Check the logs: `/storage/emulated/0/Lynx/Lynx.log`
2. Review the documentation: `WEBUI_README.md`
3. Submit an issue on GitHub: https://github.com/Zy0x/Lynx-Beta

## License

Apache License 2.0 - See LICENSE file for details

---

**Last Updated**: March 27, 2026
**Version**: 1.0.0
