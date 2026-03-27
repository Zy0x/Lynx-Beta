# Lynx-Beta WebUI - Static Build

## Overview

This folder contains the pre-built, production-ready WebUI for Lynx-Beta that can be directly served by KernelSU WebUI module.

## Structure

```
webui/
├── static/                    # Production-ready static files
│   ├── index.html            # Main HTML entry point
│   └── assets/               # JavaScript, CSS, and font files
│       ├── *.js              # JavaScript bundles (336 files)
│       ├── *.css             # Stylesheet (1 file)
│       └── *.woff*/*.ttf     # Font files (59 files)
├── client/                   # React source code
├── server/                   # Backend tRPC API (optional)
└── WEBUI_README.md          # Feature documentation
```

## File Statistics

- **Total Files**: 397
- **HTML Files**: 1 (index.html)
- **JavaScript Files**: 336
- **CSS Files**: 1
- **Font Files**: 59
- **Total Size**: ~15 MB

## How to Use with KernelSU

### Option 1: Direct File Serving

Copy the `static` folder contents to your KernelSU module's web directory:

```bash
# On your development machine
cp -r webui/static/* /path/to/kernelsu/module/webui/

# Or via ADB
adb push webui/static/* /data/adb/modules/Lynx/webui/
```

### Option 2: Module Integration

Add to your module's `service.sh`:

```bash
# Create webui directory
mkdir -p $MODPATH/webui

# Copy static files
cp -r $MODPATH/webui_src/static/* $MODPATH/webui/

# Set permissions
chmod -R 755 $MODPATH/webui
```

### Option 3: KernelSU WebUI Module

If using KernelSU's WebUI module:

1. Place `index.html` in the module's root or designated webui folder
2. Place `assets/` folder in the same directory
3. KernelSU will serve these files automatically

## Features Included

✅ **Real-Time System Monitoring**
- CPU, GPU, RAM, Thermal metrics
- ZRAM usage tracking
- Live updates every 2 seconds

✅ **Performance Mode Control**
- Auto (AI-driven)
- Aggressive
- High Performance
- Powersave

✅ **Thermal Management**
- Enable/disable thermal engine
- Temperature monitoring
- Throttling status

✅ **ZRAM Configuration**
- Size selection (1GB to 6GB)
- Algorithm configuration
- Real-time usage display

✅ **Charging Control**
- Custom charge limits (50-100%)
- Flow control settings
- Battery optimization

✅ **System Configuration**
- BusyBox installation checker
- Configuration file editor
- Device information display

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Initial Load**: ~2-3 seconds
- **Metrics Update**: 2-second intervals
- **Memory Usage**: ~50-100 MB (runtime)
- **CPU Impact**: <1% idle

## Troubleshooting

### WebUI Not Loading

1. **Check file permissions**
```bash
ls -la /data/adb/modules/Lynx/webui/
chmod -R 755 /data/adb/modules/Lynx/webui/
```

2. **Verify index.html exists**
```bash
ls -la /data/adb/modules/Lynx/webui/index.html
```

3. **Check assets folder**
```bash
ls -la /data/adb/modules/Lynx/webui/assets/
```

### Assets Not Loading

1. **Verify assets folder path**
   - Should be: `webui/assets/`
   - Check file permissions: `chmod -R 644 assets/`

2. **Check browser console**
   - Open DevTools (F12)
   - Look for 404 errors
   - Verify asset paths in index.html

### Slow Loading

1. **Clear browser cache**
   - Ctrl+Shift+Delete (Chrome)
   - Cmd+Shift+Delete (Firefox)

2. **Check network**
   - Ensure stable connection
   - Try on different WiFi/USB

## Building from Source

To rebuild the WebUI from source:

```bash
cd webui
pnpm install
pnpm build

# Output will be in dist/public/
# Copy to static/ folder
cp -r dist/public/* static/
```

## Development

For development with hot reload:

```bash
cd webui
pnpm dev

# Access at http://localhost:3000
```

## API Integration

The static WebUI can communicate with a backend server via:

1. **tRPC API** (if backend is running)
   - Endpoint: `/api/trpc/system.*`
   - Type-safe queries and mutations

2. **Direct KernelSU APIs** (browser-side)
   - Using `kernelsu` npm package
   - Direct command execution

## Security Notes

- All files are minified and optimized
- No source maps in production
- CORS policies apply if backend is separate
- Validate all user inputs on backend

## License

Apache License 2.0 - See LICENSE file for details

## Support

For issues or questions:
1. Check the browser console for errors
2. Review `/storage/emulated/0/Lynx/Lynx.log`
3. Submit an issue on GitHub

---

**Last Updated**: March 27, 2026
**Version**: 1.0.0
**Build Date**: 2026-03-27
