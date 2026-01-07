const WebSocket = require("ws");
const ffmpeg = require("fluent-ffmpeg");

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log("WebSocket ativo na porta", PORT);

wss.on("connection", (ws) => {
  console.log("Dizparos conectou");

  const audioFile = "./d5ee4a14f_converted_carrefur-G-01.wav";

  ffmpeg(audioFile)
    .audioCodec("pcm_s16le")
    .audioFrequency(8000)
    .audioChannels(1)
    .format("s16le")
    .on("start", () => {
      console.log("Iniciando envio de áudio");
    })
    .on("error", (err) => {
      console.error("Erro FFmpeg:", err);
      ws.close();
    })
    .pipe()
    .on("data", (chunk) => {
      ws.send(chunk);
    })
    .on("end", () => {
      console.log("Áudio finalizado");
      ws.close();
    });
});
