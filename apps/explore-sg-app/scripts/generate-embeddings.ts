import { createClient } from '@supabase/supabase-js';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const supabaseUrl = 'https://ltevqkkcrzprnpmzcjrq.supabase.co';
const supabaseKey = 'sb_publishable_XrmnefWcM4RgrDwzWH6qxg_taUA2v8g';
const supabase = createClient(supabaseUrl, supabaseKey);

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

function buildPlaceText(place: any): string {
  const parts = [place.name];
  if (place.overview) parts.push(place.overview);
  if (place.address) parts.push(`Located at ${place.address}`);
  if (place.nearest_mrt) parts.push(`Near ${place.nearest_mrt} MRT`);
  if (place.best_for?.length) parts.push(`Best for: ${place.best_for.join(', ')}`);
  if (place.duration) parts.push(`Duration: ${place.duration}`);
  if (place.cost) parts.push(`Cost: ${place.cost}`);
  if (place.tags?.length) parts.push(`Categories: ${place.tags.join(', ')}`);
  return parts.join('. ');
}

async function getEmbedding(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: text,
      dimensions: 1024,
      normalize: true,
    }),
  });

  const response = await bedrock.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.embedding;
}

async function main() {
  console.log('Fetching places from Supabase...');
  const { data: places, error } = await supabase.from('places').select('*');

  if (error || !places) {
    console.error('Failed to fetch places:', error);
    process.exit(1);
  }

  console.log(`Found ${places.length} places. Generating embeddings...`);

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const text = buildPlaceText(place);

    try {
      const embedding = await getEmbedding(text);

      const { error: updateError } = await supabase
        .from('places')
        .update({ embedding: embedding })
        .eq('id', place.id);

      if (updateError) {
        console.error(`Failed to update place ${place.id} (${place.name}):`, updateError);
      } else {
        console.log(`[${i + 1}/${places.length}] ${place.name} ✓`);
      }
    } catch (err) {
      console.error(`Error embedding place ${place.id} (${place.name}):`, err);
    }

    // Small delay to avoid rate limits
    if (i % 10 === 9) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('Done!');
}

main();
