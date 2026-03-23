export async function GET() {
  return new Response("FAIL: Forced 500 status code for testing", { status: 500 });
}
