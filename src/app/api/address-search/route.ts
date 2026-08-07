import { searchAustralianAddresses } from "@/lib/address-search/photon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (query.trim().length < 3) {
    return Response.json({ suggestions: [] });
  }

  const suggestions = await searchAustralianAddresses(query);
  return Response.json({ suggestions });
}
