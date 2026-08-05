export async function askClaude(prompt: string, context = '') {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return { error: 'Chave da API Claude não configurada', response: '' }
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6-20261001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: context ? `${context}\n\n${prompt}` : prompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: text, response: '' }
    }

    const data = await res.json()
    return {
      response: data.content?.map((c: any) => c.text).join('') || '',
      error: '',
    }
  } catch (err) {
    return { error: String(err), response: '' }
  }
}

export async function askGroq(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return { error: 'Chave da API Groq não configurada', response: '' }
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: text, response: '' }
    }

    const data = await res.json()
    return { response: data.choices?.[0]?.message?.content || '', error: '' }
  } catch (err) {
    return { error: String(err), response: '' }
  }
}

export async function askHybrid(prompt: string, context = '') {
  let result = await askClaude(prompt, context)

  if (result.error) {
    result = await askGroq(prompt)
  }

  return result
}
