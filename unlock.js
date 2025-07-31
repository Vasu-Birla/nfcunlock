// unlock.js
import { exec } from 'child_process';
import notifier from 'node-notifier';

// Replace this with your NFC card UID (without colons)
const allowedUID = "04C15CDC2B0389";

const checkNFC = () => {
  exec('nfc-poll', (err, stdout, stderr) => {
    if (err || stderr) {
      console.error('❌ NFC error:', err || stderr);
      return;
    }

    const match = stdout.match(/UID.*?: (.*)/);
    if (match) {
      const uid = match[1].replace(/:/g, '').trim().toUpperCase();
      console.log("🔍 Detected UID:", uid);

      if (uid === allowedUID) {
        console.log("✅ Access Granted — taking screenshot...");
        notifier.notify({ title: 'NFC Trigger', message: '✅ Card matched — Screenshot captured' });
        takeScreenshot();
      } else {
        console.log("❌ Invalid UID");
        notifier.notify({ title: 'NFC Trigger', message: '❌ Unauthorized Card' });
      }
    } else {
      console.log("⚠️ No card detected");
    }
  });
};

const takeScreenshot = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `/sdcard/Download/nfc_capture_${timestamp}.png`;

  exec(`su -c "screencap -p '${path}'"`, (err) => {
    if (err) {
      console.error("❌ Screenshot failed:", err.message);
    } else {
      console.log(`📸 Screenshot saved at: ${path}`);
    }
  });
};

// Start NFC check loop every 5 seconds
setInterval(checkNFC, 5000);
