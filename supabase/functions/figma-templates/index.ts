import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const FIGMA_API_URL = "https://api.figma.com/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fileId, nodeId } = await req.json();
    const figmaToken = Deno.env.get("FIGMA_ACCESS_TOKEN");

    if (!figmaToken) {
      throw new Error("Figma access token not configured");
    }

    // Fetch file data from Figma
    const fileResponse = await fetch(
      `${FIGMA_API_URL}/files/${fileId}/nodes?ids=${nodeId}`,
      {
        headers: {
          "X-Figma-Token": figmaToken,
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Figma API error: ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();

    // Get image render
    const imageResponse = await fetch(
      `${FIGMA_API_URL}/images/${fileId}?ids=${nodeId}&format=png`,
      {
        headers: {
          "X-Figma-Token": figmaToken,
        },
      }
    );

    if (!imageResponse.ok) {
      throw new Error(`Figma image API error: ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();

    return new Response(
      JSON.stringify({
        template: fileData.nodes[nodeId],
        preview: imageData.images[nodeId],
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});