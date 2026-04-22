import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
    console.log('--- UPLOAD ROUTE HIT ---');
    let body;
    try {
        body = (await request.json()) as HandleUploadBody;
        console.log('UPLOAD EVENT TYPE:', body.type);
    } catch (e) {
        console.error('Failed to parse upload body:', e);
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                console.log('Generating token for:', pathname);
                const session = await getSession();
                if (!session) {
                    console.log('Token generation REJECTED: No valid session cookie found.');
                    throw new Error('Unauthorized');
                }
                console.log('Session validated for user ID:', session.id);

                return {
                    tokenPayload: JSON.stringify({
                        userId: session.id,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('SUCCESS: Blob uploaded to', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error('!!! VERCEL BLOB UPLOAD FATAL ERROR !!!');
        console.error(error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
