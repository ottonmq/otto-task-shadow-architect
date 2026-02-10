import { Hono } from 'hono'
import { Anthropic } from '@anthropic-ai/sdk'

const app = new Hono()

// Configuración de la IA (Cerebro del Shadow Architect)
const anthropic = new Anthropic({
  apiKey: 'TU_API_KEY_DE_ANTHROPIC', // Aquí irá la llave del hackathon
})

app.get('/', (c) => c.text('🏮 Otto-Task Shadow Architect: ONLINE'))

// Este es el "Webhook" que escuchará a GitLab
app.post('/analyze-code', async (c) => {
  const body = await c.req.json()
  const codeSnippet = body.code // El código que acabas de subir

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    system: "You are the Shadow Architect. Analyze the code for security flaws and return ONLY the corrected version.",
    messages: [{ role: 'user', content: `Analyze this code: ${codeSnippet}` }],
  })

  console.log("🏮 AI Analysis Complete:", response.content)
  
  return c.json({
    status: 'analyzed',
    suggestion: response.content
  })
})

export default app
