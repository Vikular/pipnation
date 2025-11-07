// Minimal test function - no dependencies
Deno.serve(() => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Function boots successfully',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
});
