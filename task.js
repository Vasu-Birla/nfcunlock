// unlock.js
import { exec } from 'child_process';
import notifier from 'node-notifier';

// Replace this UID with your NFC card UID (without colons)
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
        console.log("📞 Calling 7999806490...");
        notifier.notify({ title: 'NFC Trigger', message: '📞 Calling 7999806490' });
        makePhoneCall();
      } else {
        console.log("❌ Invalid UID");
        notifier.notify({ title: 'NFC Trigger', message: '❌ Unauthorized Card' });
      }
    } else {
      console.log("⚠️ No card detected");
    }
  });
};

const makePhoneCall = () => {
  exec('termux-telephony-call 7999806490', (err) => {
    if (err) {
      console.error("❌ Failed to initiate call:", err.message);
    } else {
      console.log("✅ Call command sent.");
    }
  });
};

// Start NFC check loop every 5 seconds
setInterval(checkNFC, 5000);
