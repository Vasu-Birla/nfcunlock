// unlock.js
import { exec } from 'child_process';
import notifier from 'node-notifier';

// Replace this UID with your card's UID (no colons)
const allowedUID = "04ABC5117F2880";

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
        console.log("✅ Access Granted");
        notifier.notify({ title: 'NFC Unlock', message: '✅ Access Granted' });
        unlockPhone();
      } else {
        console.log("❌ Invalid UID");
        notifier.notify({ title: 'NFC Unlock', message: '❌ Invalid Card' });
      }
    } else {
      console.log("⚠️ No card detected");
    }
  });
};

const unlockPhone = () => {
  exec('su -c "input keyevent 26; input swipe 300 1000 300 500; input keyevent 82"', (err) => {
    if (err) {
      console.error('❌ Unlock failed:', err.message);
    } else {
      console.log("🔓 Phone Unlocked!");
    }
  });
};

setInterval(checkNFC, 5000); // Check every 5 seconds
