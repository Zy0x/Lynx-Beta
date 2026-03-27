# Lynx WebUI - Standalone Build

Ini adalah build standalone dari Lynx WebUI yang dapat digunakan langsung tanpa perlu build tools.

## 📦 File Structure

```
lynx-webui-standalone/
├── index.html          # HTML utama (dengan referensi eksternal ke CSS/JS)
├── style.css          # Stylesheet (123 KB)
├── app.js             # JavaScript aplikasi (613 KB)
├── standalone.html    # Alternatif: Single-file HTML (untuk testing)
└── README.md          # File ini
```

## 🚀 Cara Menggunakan

### Opsi 1: Gunakan index.html (Recommended)
```bash
# Buka di browser
open index.html

# Atau jalankan local server
python3 -m http.server 8000
# Akses: http://localhost:8000
```

### Opsi 2: Deploy ke KernelSU Module
```bash
# Copy ke module webroot
cp -r /home/ubuntu/lynx-webui-standalone/* /data/adb/modules/Lynx/webroot/

# Restart KernelSU Manager atau reboot device
```

### Opsi 3: Gunakan standalone.html (Single File)
```bash
# Buka standalone.html di browser
# File ini berisi semua CSS dan JS inline
open standalone.html
```

## 🧪 Testing Mock API

### Di Browser Console (F12):
```javascript
// Aktifkan mock API
localStorage.setItem('__mock_kernelsu', JSON.stringify({
  enabled: true,
  isRoot: true,
  uid: '0',
  delay: 300
}));
location.reload();

// Atau gunakan URL parameter
// http://localhost:8000?mock=true&root=true
```

### Toggle Root Mode
- Klik ikon ⚡ (petir) di navbar kanan
- Pilih "Mock API" untuk ON/OFF
- Pilih "Root Access" untuk toggle ROOT ↔ LIMITED

## 📊 File Sizes

| File | Size | Compressed |
|------|------|-----------|
| index.html | 360 KB | 105 KB (gzip) |
| style.css | 123 KB | 19.8 KB (gzip) |
| app.js | 613 KB | 171 KB (gzip) |
| **Total** | **1.1 MB** | **296 KB (gzip)** |

## 🔧 Kustomisasi

### Ubah Title
Edit `index.html`:
```html
<title>Lynx WebUI - KernelSU Module Dashboard</title>
```

### Ubah Warna Tema
Edit `style.css` - cari `:root { --primary: ...`:
```css
:root {
  --primary: #0ea5e9;      /* Cyan */
  --accent: #10b981;       /* Emerald */
  --destructive: #ef4444;  /* Red */
}
```

### Disable Mock API (Production)
Edit `app.js` - cari `initMockAPI()` dan comment out:
```javascript
// initMockAPI(); // Disabled for production
```

## 🐛 Troubleshooting

### Blank Page
1. Buka F12 → Console
2. Cek error messages
3. Pastikan browser support ES6 modules

### Mock API Tidak Bekerja
1. Buka F12 → Console
2. Jalankan: `console.log(window.kernelsu)`
3. Pastikan localStorage tidak disabled

### Styling Tidak Muncul
1. Pastikan `style.css` ada di folder yang sama
2. Check browser console untuk 404 errors
3. Refresh cache (Ctrl+Shift+R)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

- Mock API hanya aktif di development mode
- Tidak ada data yang dikirim ke server eksternal
- Semua data disimpan di localStorage (device lokal)
- Untuk production: disable mock API dan gunakan real KernelSU API

## 📚 Dokumentasi Lengkap

Lihat `/home/ubuntu/lynx-webui/README.md` untuk dokumentasi lengkap tentang:
- Arsitektur aplikasi
- KernelSU API integration
- Custom hooks
- Component structure
- Deployment guide

## 🚢 Deploy ke Production

### Opsi 1: KernelSU Module
```bash
cp -r * /data/adb/modules/Lynx/webroot/
chmod -R 755 /data/adb/modules/Lynx/webroot/
```

### Opsi 2: Web Server
```bash
# Nginx
cp -r * /var/www/html/lynx/

# Apache
cp -r * /var/www/lynx/
```

### Opsi 3: Cloud Hosting (Netlify, Vercel, etc.)
```bash
# Drag & drop folder ke Netlify
# Atau: netlify deploy --prod --dir=.
```

## 📝 License

MIT License - Lihat LICENSE file

---

**Made with ❤️ for KernelSU**

Last Updated: March 28, 2026
