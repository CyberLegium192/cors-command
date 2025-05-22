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


app.get("/proxy", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    const decodedUrl = decodeURIComponent(url);

    // Redirect browser langsung ke URL target
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.redirect(decodedUrl);
});



// Tambahkan handler untuk Vercel
export default app;
