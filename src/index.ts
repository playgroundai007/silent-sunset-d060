export default {
  async fetch(request: Request, env: Env) {
    try {
      // Получаем prompt из query string (для GET запросов)
      const url = new URL(request.url);
      let prompt = url.searchParams.get('prompt');

      // Если prompt не в query string, пробуем получить из тела запроса (для POST)
      if (!prompt && request.method === 'POST') {
        const body = await request.json();
        prompt = body.prompt;
      }

      // Если prompt не указан, используем значение по умолчанию
      if (!prompt) {
        prompt = "cyberpunk cat";
      }

      const inputs = {
        prompt: prompt,
      };

      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs,
      );

      return new Response(response, {
        headers: {
          "content-type": "image/png",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
} satisfies ExportedHandler<Env>;
