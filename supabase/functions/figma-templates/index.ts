import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fileId, nodeId } = await req.json();
    const figmaToken = Deno.env.get("FIGMA_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!figmaToken || !supabaseUrl || !supabaseKey) {
      throw new Error("Required environment variables are not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch file data from Figma
    console.log('Fetching Figma file data:', fileId, nodeId);
    const fileResponse = await fetch(
      `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`,
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
    console.log('Received Figma file data');

    // Get image render
    console.log('Fetching Figma image render');
    const imageResponse = await fetch(
      `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png`,
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
    console.log('Received Figma image data');

    // Extract template metadata from Figma response
    const node = fileData.nodes[nodeId].document;
    const templateData = {
      description: node.description || "No description available",
      name: node.name,
      styles: node.styles || {},
      componentProperties: node.componentProperties || {},
    };

    // Store template in Supabase
    const { data: template, error: templateError } = await supabase
      .from('resume_templates')
      .upsert({
        figma_file_id: fileId,
        figma_node_id: nodeId,
        name: templateData.name,
        preview_url: imageData.images[nodeId],
        template_data: templateData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (templateError) {
      throw new Error(`Failed to store template: ${templateError.message}`);
    }

    console.log('Successfully stored template in database');

    return new Response(
      JSON.stringify({
        template: template,
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