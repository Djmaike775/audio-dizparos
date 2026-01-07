const WebSocket = require("ws");
const ffmpeg = require("fluent-ffmpeg");

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log("✅ WebSocket ativo na porta", PORT);

wss.on("connection", (ws, req) => {
  console.log("📞 Dizparos conectou");

  ws.binaryType = "arraybuffer";

  ffmpeg("./audio.wav")
    .audioCodec("pcm_s16le")
    .audioFrequency(8000)
    .audioChannels(1)
    .format("s16le")
    .on("error", err => {
      console.error("Erro FFmpeg:", err);
      ws.close();
    })
    .pipe()
    .on("data", chunk => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(chunk);
      }
    })
    .on("end", () => {
      console.log("🔊 Áudio finalizado");
      ws.close();
    });
});
