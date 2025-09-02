import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Processing matured investments...')

    // Call the database function to process matured investments
    const { data, error } = await supabaseAdmin.rpc('process_matured_investments')

    if (error) {
      console.error('Error processing matured investments:', error)
      throw error
    }

    // Get count of investments that were processed
    const { data: processedInvestments, error: countError } = await supabaseAdmin
      .from('investments')
      .select('id, user_id, amount, total_earned, plan_name')
      .eq('status', 'completed')
      .gte('updated_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes

    if (countError) {
      console.error('Error fetching processed investments:', countError)
    }

    const processedCount = processedInvestments?.length || 0
    
    console.log(`Successfully processed ${processedCount} matured investments`)

    if (processedCount > 0) {
      console.log('Processed investments:', processedInvestments)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${processedCount} matured investments`,
        processedInvestments: processedInvestments || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in process-matured-investments function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})