import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/tes", async (req, res) => {
    try {
        res.json({
            data: ["noval", 20],
            status: 200
        });
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data" });
    }
});



app.get("/api/showroom/:room_id", async (req, res) => {
    try {
        const { room_id } = req.params;
        const response = await axios.get(`https://www.showroom-live.com/api/live/comment_log?room_id=${room_id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data" });
    }
});

app.get("/api/stream", async (req, res) => {
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: "Missing url parameter." });
    }
  
    try {
      const response = await axios.get(url, {
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "*/*",
          "Referer": "https://www.idn.live/",  // sesuaikan referer dengan sumber aslinya
          "Origin": "https://www.idn.live",
        },
        maxRedirects: 5
      });
  
      // Forward content-type dari response upstream
      res.setHeader("Content-Type", response.headers["content-type"]);
      response.data.pipe(res);
    } catch (error) {
      console.error("Proxy error:", error.message);
  
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.message,
          status: error.response.status,
          data: error.response.data
        });
      } else {
        return res.status(500).json({ error: "Unknown error" });
      }
    }
  });
  

// Tambahkan handler untuk Vercel
export default app;
