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

    if (!url) return res.status(400).json({ error: "Parameter 'url' diperlukan." });

    try {
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                // Jika diperlukan, tambahkan custom headers
                'Origin': 'https://dc.crstlnz.my.id'
            }
        });

        // Set content type dan stream video-nya
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error("Error saat mem-proxy video:", error.message);
        res.status(500).json({ error: "Gagal memuat stream." });
    }
});


// Tambahkan handler untuk Vercel
export default app;
