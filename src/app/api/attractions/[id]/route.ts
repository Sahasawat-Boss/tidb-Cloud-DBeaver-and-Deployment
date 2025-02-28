import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "../../../../../server/db";
import { RowDataPacket } from "mysql2/promise";

// ✅ Define the expected type for the second argument
interface Context {
    params: { id: string };
}

export async function GET(request: NextRequest, context: Context) {
    try {
        const { id } = context.params;
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
