import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en'] as const;
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
    const isSpanishPath = pathname === '/es' || pathname.startsWith('/es/');
    const isEnglishHome = pathname === '/en' || pathname === '/en/';
    const isRoot = pathname === '/';

    if (isSpanishPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/en';
        return NextResponse.redirect(url);
    }

    if (isEnglishHome) return NextResponse.next();

    if (!isRoot) {
        const url = request.nextUrl.clone();
        url.pathname = '/en';
        return NextResponse.redirect(url);
    }

    const hasLocale = LOCALES.some(
        (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`,
    );

    if (hasLocale) return NextResponse.next();

    const locale = detectLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ['/((?!_next|_vercel|favicon.ico|.*\\..*).*)'],
};
