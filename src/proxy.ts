import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/session";

const LOGIN_PATH = "/painel/login";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === LOGIN_PATH;

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (!isLoginRoute && !session?.userId) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL("/painel/imoveis", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
