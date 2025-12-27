import mediasoup from "mediasoup";

let worker, router;

export const initMediasoup = async () => {
  worker = await mediasoup.createWorker();
  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2
      }
    ]
  });
  console.log("✅ mediasoup ready");
  return router;
};

export const getRouter = () => router;
