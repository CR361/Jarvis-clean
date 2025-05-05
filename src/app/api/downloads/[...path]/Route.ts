// File: app/api/download/[...path]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Configureer Supabase server-side client met Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  // Verkrijg het pad na /api/download/
  const path = decodeURIComponent(request.nextUrl.pathname.replace('/api/download/', ''));

  // Download het bestand uit de bucket, path bevat de volledige opslaglocatie
  const { data, error } = await supabase.storage
    .from('bestanden-emails')
    .download(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  }

  // Stel headers in om de browser te forceren tot downloaden
  const filename = path.split('/').pop() || 'file';
  const headers = new Headers({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Type': data.type || 'application/octet-stream',
  });

  return new NextResponse(data, { status: 200, headers });
}
