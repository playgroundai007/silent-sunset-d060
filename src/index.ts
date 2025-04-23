interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env) {
    // Разрешаем только GET или POST запросы
    if (!['GET', 'POST'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let prompt = "cyberpunk cat"; // значение по умолчанию

    // Пытаемся получить prompt из query параметров (GET)
    const url = new URL(request.url);
    const queryPrompt = url.searchParams.get('prompt');
    if (queryPrompt) {
      prompt = queryPrompt;
    }
    // Или из тела запроса (POST)
    else if (request.method === 'POST') {
      try {
        const body = await request.json();
        if (body.prompt) {
          prompt = body.prompt;
        }
      } catch (e) {
        console.error('Error parsing JSON body:', e);
      }
    }

    try {
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      return new Response(response, {
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=3600" // кешируем на 1 час
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: "Image generation failed",
          details: error.message 
        }),
        { 
          status: 500,
          headers: { "content-type": "application/json" }
        }
      );
    }
  }
} satisfies ExportedHandler<Env>;
