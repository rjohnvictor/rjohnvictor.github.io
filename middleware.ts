import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'hi', 'ta'] as const;
const DEFAULT_LOCALE = 'en';

function detectLocale(request: NextRequest): string {
    const acceptLang = request.headers.get('accept-language') ?? '';
    const preferred = acceptLang.split(',')[0].trim().slice(0, 2).toLowerCase();
    return (LOCALES as readonly string[]).includes(preferred)
        ? preferred
        : DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasLocale = LOCALES.some(
        (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`,
    );

    if (hasLocale) return NextResponse.next();

    const url = request.nextUrl.clone();
    const locale = detectLocale(request);

    if (pathname === '/') {
        url.pathname = `/${locale}`;
    } else {
        url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    }

    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/((?!_next|_vercel|favicon.ico|.*\\..*).*)'],
};
