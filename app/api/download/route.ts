import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export const maxDuration = 300; // 5 minutes timeout

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!ytdl.validateURL(url)) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        // Get basic video info first
        const basicInfo = await ytdl.getBasicInfo(url);
        const videoLength = parseInt(basicInfo.videoDetails.lengthSeconds);

        // Optional: Add length check to prevent very large downloads
        if (videoLength > 600) { // 10 minutes max
            return NextResponse.json({ 
                error: 'Video is too long. Maximum length is 10 minutes.' 
            }, { status: 400 });
        }

        // Create a safe filename
        const safeFilename = `${basicInfo.videoDetails.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}.mp4`;

        // Get the video stream with specific format options
        const videoStream = ytdl(url, {
            quality: 'highestvideo',
            filter: 'videoandaudio',
            requestOptions: {
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        });

        // Convert Node.js readable stream to Web Stream
        const webStream = new ReadableStream({
            start(controller) {
                videoStream.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });
                videoStream.on('end', () => {
                    controller.close();
                });
                videoStream.on('error', (err) => {
                    controller.error(err);
                });
            },
        });

        // Return stream response
        return new Response(webStream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${safeFilename}"`,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Server error' 
        }, { status: 500 });
    }
}
