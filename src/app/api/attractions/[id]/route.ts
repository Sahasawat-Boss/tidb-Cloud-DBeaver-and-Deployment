import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "../../../../../server/db";
import { RowDataPacket } from "mysql2/promise";

// ✅ Correct type definition for Next.js 15+ API route
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // 🚀 FINAL FIX: Strictly define `id` as `string` (not optional)
) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        const connection = await mysqlPool.getConnection();
        const [rows] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM attractions WHERE id = ?",
            [params.id]
        );
        connection.release();

        return NextResponse.json(rows.length > 0 ? rows[0] : { error: "Not Found" }, { status: rows.length > 0 ? 200 : 404 });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
