import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'src/data/content.json');

export async function GET() {
    try {
        const fileContents = fs.readFileSync(contentPath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newData = await request.json();

        // Simple authentication check (in a real app, use a proper session/cookie)
        // For now, we'll assume the client-side handles basic visibility, 
        // but we can add a secret header here.
        const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123';
        const authHeader = request.headers.get('x-admin-secret');
        if (authHeader !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        fs.writeFileSync(contentPath, JSON.stringify(newData, null, 2), 'utf8');
        return NextResponse.json({ message: 'Content updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
