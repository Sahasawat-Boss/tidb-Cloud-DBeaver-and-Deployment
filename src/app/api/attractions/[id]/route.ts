import { NextResponse } from "next/server";
import { mysqlPool } from "@/server/db";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: { id: string } } // Keep params inside context
) {
    try {
        const params = await context.params; // Await params before accessing it
        const id = params.id; // Now params is properly resolved

        if (!id) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const connection = await mysqlPool.getConnection();
        const [rows] = await connection.query("SELECT * FROM attractions WHERE id = ?", [id]);
        connection.release();

        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
