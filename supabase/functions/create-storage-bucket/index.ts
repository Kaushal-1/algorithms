
// Edge function to create a storage bucket for avatars if it doesn't exist
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Create a Supabase client with the Admin key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

Deno.serve(async () => {
  try {
    // Check if the bucket already exists
    const { data: existingBuckets } = await supabaseAdmin.storage.listBuckets();
    const avatarBucketExists = existingBuckets?.some(bucket => bucket.name === 'avatars');
    
    if (!avatarBucketExists) {
      // Create public avatars bucket
      const { data, error } = await supabaseAdmin.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 2097152, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
      });
      
      if (error) {
        throw error;
      }
      
      return new Response(JSON.stringify({ success: true, message: "Avatars bucket created" }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    return new Response(JSON.stringify({ success: true, message: "Avatars bucket already exists" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error creating bucket:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
