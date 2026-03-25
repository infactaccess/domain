/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
    try {
        const logoData = readFileSync(join(process.cwd(), 'public', 'logo.png'));
        const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                    }}
                >
                    <img
                        src={logoSrc}
                        alt=""
                        style={{ width: '220%', height: '220%', objectFit: 'contain' }}
                    />
                </div>
            ),
            { ...size }
        );
    } catch {
        return new Response('Icon not found', { status: 404 });
    }
}
