import fs from "fs";

export const startAdminRecording = (roomId) => {
  const file = `recordings/admin/${roomId}.raw`;
  const stream = fs.createWriteStream(file);
  console.log("🎙️ Admin recording started:", file);
  return stream;
};
