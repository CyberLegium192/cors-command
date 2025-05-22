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

function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        stream.on("error", reject);
    });
}


app.get("/proxy", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    try {
        const decodedUrl = decodeURIComponent(url);

        console.log("Proxying URL:", decodedUrl); // 🐛 log URL

        const response = await axios({
            url: decodedUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
                'Origin': 'https://cors-command-2.vercel.app',
                'Referer': 'https://cors-command-2.vercel.app'
            },
            timeout: 5000 // optional timeout
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        response.data.pipe(res);
    } catch (error) {
        console.error("🔥 Proxy error:");
        console.error("→ message:", error.message);
        if (error.response) {
            console.error("→ status:", error.response.status);
            console.error("→ headers:", error.response.headers);
            console.error("→ data:", await streamToString(error.response.data));
        }
        res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
});





// Tambahkan handler untuk Vercel
export default app;
