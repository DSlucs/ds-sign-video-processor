const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Permitir todas origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Adicionar headers CORS manualmente também
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Multer para upload de arquivos
const upload = multer({
    dest: '/tmp/',
    limits: {
        fileSize: 500 * 1024 * 1024 // 500 MB
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'DS SIGN Video Processor',
        version: '1.0.0',
        endpoints: {
            process: 'POST /process',
            health: 'GET /health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Endpoint principal de processamento
app.post('/process', upload.single('video'), async (req, res) => {
    const startTime = Date.now();

    console.log('📹 Recebendo vídeo para processamento...');
    console.log('Tamanho:', req.file.size, 'bytes');

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum vídeo enviado' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('/tmp', `output_${Date.now()}.mp4`);

    // Parâmetros de processamento
    const cropX = parseInt(req.body.cropX) || 0;
    const cropY = parseInt(req.body.cropY) || 0;
    const cropW = parseInt(req.body.cropW) || 1920;
    const cropH = parseInt(req.body.cropH) || 1080;
    const scaleW = parseInt(req.body.scaleW) || 1920;
    const scaleH = parseInt(req.body.scaleH) || 1080;
    const bitrate = req.body.bitrate || '5000k';

    console.log(`🎬 Processando: crop=${cropW}x${cropH}+${cropX}+${cropY}, scale=${scaleW}x${scaleH}`);

    try {
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoFilters([
                    `crop=${cropW}:${cropH}:${cropX}:${cropY}`,
                    `scale=${scaleW}:${scaleH}`
                ])
                .videoCodec('libx264')
                .videoBitrate(bitrate)
                .outputOptions([
                    '-preset fast',
                    '-profile:v main',
                    '-level 4.0',
                    '-pix_fmt yuv420p',
                    '-movflags +faststart'
                ])
                .noAudio()
                .output(outputPath)
                .on('start', (cmd) => {
                    console.log('🚀 FFmpeg iniciado:', cmd);
                })
                .on('progress', (progress) => {
                    console.log(`⚙️ Progresso: ${Math.round(progress.percent || 0)}%`);
                })
                .on('end', () => {
                    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                    console.log(`✅ Processamento concluído em ${duration}s`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('❌ Erro FFmpeg:', err.message);
                    reject(err);
                })
                .run();
        });

        // Ler arquivo processado
        const videoBuffer = fs.readFileSync(outputPath);
        const fileSize = videoBuffer.length;

        console.log(`📦 Enviando vídeo processado: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        // Limpar arquivos temporários
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        // Retornar vídeo
        res.set({
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize,
            'Content-Disposition': 'attachment; filename="processed.mp4"'
        });
        res.send(videoBuffer);

    } catch (error) {
        console.error('❌ Erro no processamento:', error);

        // Limpar arquivos em caso de erro
        try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) { }

        res.status(500).json({
            error: 'Erro ao processar vídeo',
            details: error.message
        });
    }
});

// Endpoint para converter WebM → MP4
app.post('/convert', upload.single('video'), async (req, res) => {
    const startTime = Date.now();

    console.log('🔄 Recebendo WebM para conversão...');
    console.log('Tamanho:', req.file?.size || 0, 'bytes');

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum vídeo enviado' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('/tmp', `converted_${Date.now()}.mp4`);

    console.log('🎬 Convertendo WebM → MP4 H.264...');

    try {
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec('libx264')
                .videoBitrate('5000k')
                .outputOptions([
                    '-preset fast',
                    '-profile:v main',
                    '-level 4.0',
                    '-pix_fmt yuv420p',
                    '-movflags +faststart'
                ])
                .audioCodec('aac')
                .audioBitrate('128k')
                .output(outputPath)
                .on('start', (cmd) => {
                    console.log('🚀 FFmpeg iniciado:', cmd);
                })
                .on('progress', (progress) => {
                    console.log(`⚙️ Progresso: ${Math.round(progress.percent || 0)}%`);
                })
                .on('end', () => {
                    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                    console.log(`✅ Conversão concluída em ${duration}s`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('❌ Erro FFmpeg:', err.message);
                    reject(err);
                })
                .run();
        });

        // Ler arquivo convertido
        const videoBuffer = fs.readFileSync(outputPath);
        const fileSize = videoBuffer.length;

        console.log(`📦 Enviando MP4: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        // Limpar arquivos temporários
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        // Retornar MP4
        res.set({
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize,
            'Content-Disposition': 'attachment; filename="converted.mp4"'
        });
        res.send(videoBuffer);

    } catch (error) {
        console.error('❌ Erro na conversão:', error);

        // Limpar arquivos em caso de erro
        try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) { }

        res.status(500).json({
            error: 'Erro ao converter vídeo',
            details: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`✅ Pronto para processar vídeos!`);
});
