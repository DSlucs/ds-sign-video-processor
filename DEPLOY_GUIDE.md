# 🚀 Guia de Deploy - Render.com

## 📋 Pré-requisitos

- Conta GitHub (grátis)
- Conta Render.com (grátis)
- Git instalado

---

## 🎯 Passo 1: Criar Repositório GitHub

### 1.1 Criar repositório no GitHub
1. Ir para https://github.com/new
2. Nome: `video-processor`
3. Descrição: `DS SIGN Video Wall Processor`
4. Público ou Privado (tanto faz)
5. **NÃO** inicializar com README
6. Criar repositório

### 1.2 Fazer push do código
```powershell
cd "c:\Users\LucasSouza\Documents\Projetos\criador de video wall\render-video-processor"

git init
git add .
git commit -m "Initial commit - Video processor with FFmpeg"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/video-processor.git
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu username do GitHub!**

---

## 🎯 Passo 2: Deploy no Render.com

### 2.1 Criar conta Render
1. Ir para https://render.com/
2. Clicar em **Get Started**
3. Sign up com GitHub
4. Autorizar Render a acessar GitHub

### 2.2 Criar Web Service
1. Dashboard → **New +** → **Web Service**
2. Conectar repositório:
   - Clicar em **Connect a repository**
   - Selecionar `video-processor`
   - Clicar em **Connect**

### 2.3 Configurar Service
Preencher:
- **Name**: `video-processor` (ou outro nome único)
- **Region**: `Oregon (US West)` (mais próximo)
- **Branch**: `main`
- **Root Directory**: (deixar vazio)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: **Free** ✅

### 2.4 Variáveis de Ambiente
Não precisa configurar nada! Deixe vazio.

### 2.5 Deploy!
1. Clicar em **Create Web Service**
2. Aguardar deploy (~2-5 minutos)
3. Ver logs em tempo real

---

## ✅ Passo 3: Obter URL do Serviço

Após deploy concluído:
1. Copiar URL: `https://video-processor-xxxx.onrender.com`
2. Testar: Abrir URL no navegador
3. Deve mostrar:
```json
{
  "status": "ok",
  "service": "DS SIGN Video Processor",
  "version": "1.0.0"
}
```

---

## 🎯 Passo 4: Configurar Frontend

Editar `onsign-videowall-v13-render.html`:

```javascript
const RENDER_API_URL = 'https://video-processor-xxxx.onrender.com';
```

**Substituir `xxxx` pela sua URL real!**

---

## 🧪 Passo 5: Testar

### Teste Local (Opcional)
```powershell
cd render-video-processor
npm install
npm start
```

Servidor rodará em `http://localhost:3000`

### Teste Produção
1. Upload HTML no OnSign
2. Processar vídeo pequeno (10-30s)
3. Verificar logs no Render Dashboard

---

## 📊 Monitoramento

### Ver Logs
1. Render Dashboard
2. Seu serviço → **Logs**
3. Ver em tempo real

### Métricas
1. Render Dashboard
2. Seu serviço → **Metrics**
3. Ver uso de CPU, memória, requests

---

## ⚠️ Limitações Free Tier

- **750 horas/mês** (suficiente para uso normal)
- **512 MB RAM** (suficiente para vídeos até ~5 min)
- **0.1 CPU** (processamento mais lento)
- **Spin down** após 15 min inativo (primeira request leva ~30s)

### Dica para Evitar Spin Down
Usar serviço como **UptimeRobot** (grátis) para fazer ping a cada 5 minutos:
1. https://uptimerobot.com/
2. Adicionar monitor HTTP(s)
3. URL: `https://video-processor-xxxx.onrender.com/health`
4. Intervalo: 5 minutos

---

## 🎉 Pronto!

Seu processador de vídeo está no ar!

**URL**: `https://video-processor-xxxx.onrender.com`

---

## 🔧 Troubleshooting

### Deploy falhou
- Ver logs no Render Dashboard
- Verificar se `package.json` está correto
- Verificar se `server.js` está no root

### Timeout
- Vídeos muito grandes (> 5 min) podem dar timeout
- Dividir em chunks menores no frontend

### Out of Memory
- Vídeos muito grandes podem estourar 512 MB RAM
- Usar resolução menor (720p em vez de 1080p)

---

**Próximo**: Criar frontend HTML que usa este backend!
