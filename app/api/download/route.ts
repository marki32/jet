import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Create a ReadableStream to pipe the video data
        const stream = new ReadableStream({
            async start(controller) {
                const ytDlp = spawn('yt-dlp', [
                    url,
                    '-o', '-',  // Output to stdout
                    '-f', 'best[ext=mp4]',
                ]);

                ytDlp.stdout.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });

                ytDlp.stderr.on('data', (data) => {
                    console.error(`yt-dlp error: ${data}`);
                });

                ytDlp.on('close', (code) => {
                    if (code === 0) {
                        controller.close();
                    } else {
                        controller.error(new Error('Download failed'));
                    }
                });

                ytDlp.on('error', (err) => {
                    controller.error(err);
                });
            }
        });

        // Get video title for filename
        const infoProcess = spawn('yt-dlp', [
            url,
            '--get-title'
        ]);

        let videoTitle = '';
        await new Promise((resolve) => {
            infoProcess.stdout.on('data', (data) => {
                videoTitle = data.toString().trim()
                    .replace(/[^\w\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '_');    // Replace spaces with underscores
            });
            infoProcess.on('close', resolve);
        });

        // Set a safe filename
        const safeFilename = `${videoTitle || 'video'}.mp4`;

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
