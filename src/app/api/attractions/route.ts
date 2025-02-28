import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";  // ✅ Ensure correct path
//handleGETReq
export async function GET() {
    const [rows] = await mysqlPool.query(
        "SELECT * FROM attractions;"
        //GET all Data in table attractions
    );  // ✅ No need for `.promise()`

    return NextResponse.json(rows);
}

//TEST API GET>>  http://localhost:3000/api/attractions