import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "../../../../../server/db";
import { RowDataPacket } from "mysql2/promise"; // ✅ Import correct type

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        const connection = await mysqlPool.getConnection();
        const [rows] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM attractions WHERE id = ?",
            [id]
        );
        connection.release();

        return NextResponse.json(rows.length > 0 ? rows[0] : { error: "Not Found" }, { status: rows.length > 0 ? 200 : 404 });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
