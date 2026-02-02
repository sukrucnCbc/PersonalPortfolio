import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'src/data/content.json');

export async function GET() {
    try {
        if (!fs.existsSync(contentPath)) {
            return NextResponse.json({ error: 'Content file not found' }, { status: 404 });
        }
        const fileContents = fs.readFileSync(contentPath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/content error:", error);
        return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newData = await request.json();

        const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123';
        const authHeader = request.headers.get('x-admin-secret');
        if (authHeader !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Validate data before saving
        if (!newData || typeof newData !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        fs.writeFileSync(contentPath, JSON.stringify(newData, null, 2), 'utf8');
        console.log("Content updated successfully. Size:", JSON.stringify(newData).length);

        return NextResponse.json({ message: 'Content updated successfully' });
    } catch (error: any) {
        console.error("POST /api/content error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
    }
}
