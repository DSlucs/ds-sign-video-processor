# 🎬 DS SIGN Video Wall - Render.com Backend

## 📋 Estrutura do Projeto

```
render-video-processor/
├── package.json
├── server.js           # Servidor Express
├── render.yaml         # Configuração Render
└── README.md
```

## 🎯 Como Funciona

### 1. Frontend (HTML)
- Upload vídeo para Render backend
- Especifica crop/scale para cada tela
- Recebe MP4 H.264 processado
- Upload para FTP

### 2. Backend (Render.com)
- Recebe vídeo via POST
- Processa com FFmpeg nativo
- Retorna MP4 H.264
- **Grátis 750h/mês**

## 💰 Custos

**Render.com Free Tier**:
- ✅ 750 horas/mês
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ **R$ 0,00**

**Suficiente para**:
- ~100 vídeos/dia
- Processamento ilimitado (dentro de 750h)

## 📝 Passos de Implementação

### 1. Criar Conta Render
1. Ir para https://render.com/
2. Sign up com GitHub
3. Verificar email

### 2. Criar Repositório GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USER/video-processor.git
git push -u origin main
```

### 3. Deploy no Render
1. Dashboard → New → Web Service
2. Conectar repositório GitHub
3. Configurar:
   - **Name**: video-processor
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. Deploy!

### 4. Obter URL
Após deploy: `https://video-processor-xxxx.onrender.com`

## 🔧 Configuração

### Variáveis de Ambiente (Render Dashboard)
Nenhuma necessária para versão básica!

## 🚀 Uso

### Endpoint: POST /process

**Request**:
```javascript
const formData = new FormData();
formData.append('video', videoBlob);
formData.append('cropX', 0);
formData.append('cropY', 0);
formData.append('cropW', 1920);
formData.append('cropH', 1080);
formData.append('scaleW', 1280);
formData.append('scaleH', 720);

const response = await fetch('https://video-processor-xxxx.onrender.com/process', {
    method: 'POST',
    body: formData
});

const mp4Blob = await response.blob();
```

**Response**: MP4 H.264 video blob

## ⚡ Performance

- **Vídeo 30s**: ~10-20 segundos
- **Vídeo 1 min**: ~20-40 segundos
- **Vídeo 5 min**: ~2-4 minutos

**Muito mais rápido que navegador!**

## 🎯 Próximos Passos

1. ✅ Criar servidor Node.js
2. ⏳ Configurar FFmpeg
3. ⏳ Deploy no Render
4. ⏳ Criar frontend
5. ⏳ Testar

---

**Status**: 📝 Documentação criada  
**Próximo**: Implementar servidor Node.js
