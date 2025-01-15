import { NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-exec';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const ytDlp = new YTDlpWrap();

        // Get video info first
        const videoInfo = await ytDlp.getVideoInfo(url);
        
        // Create a safe filename
        const safeFilename = `${videoInfo.title?.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_') || 'video'}.mp4`;

        // Create a ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const downloadProcess = await ytDlp.exec([
                        url,
                        '-o', '-',  // Output to stdout
                        '-f', 'best[ext=mp4]',
                    ], {
                        stdout: (chunk) => {
                            controller.enqueue(chunk);
                        },
                    });

                    await downloadProcess;
                    controller.close();
                } catch (error) {
                    console.error('Download error:', error);
                    controller.error(error);
                }
            }
        });

        // Return the stream with proper headers
        return new Response(stream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${safeFilename}"`,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
