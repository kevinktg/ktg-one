import { cookies } from 'next/headers';

const HUB_PASSWORD = process.env.HUB_PASSWORD || 'ktg-onechat-2026';

export async function POST(req) {
  const { password } = await req.json();

  if (password === HUB_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('hub-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'wrong password' }, { status: 401 });
}
