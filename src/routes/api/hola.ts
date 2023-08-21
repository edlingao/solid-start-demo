import { APIEvent, json } from "solid-start";

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'mundo';

  return json({message: `Hola ${name}`});
}

export async function POST({ request }: APIEvent) {
  const { name } = await request.json()

  return json({message: `Hola ${name}`});
}