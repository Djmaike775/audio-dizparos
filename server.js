const WebSocket = require("ws");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const wss = new WebSocket.Server({ port: 3000 });

console.log("WebSocket ativo na porta 3000");

wss.on("connection", (ws, req) => {
  console.log("Dizparos conectou");

  // áudio que será tocado
  const audioFile = "./audio.mp3";

  ffmpeg(audioFile)
    .audioCodec("pcm_s16le") // PCM obrigatório
    .audioFrequency(8000)    // 8kHz obrigatório
    .audioChannels(1)        // mono
    .format("s16le")
    .on("error", err => {
      console.error("Erro FFmpeg:", err);
      ws.close();
    })
    .pipe()
    .on("data", chunk => {
      ws.send(chunk); // envia áudio em tempo real
    })
    .on("end", () => {
      console.log("Áudio finalizado");
      ws.close();
    });
});
