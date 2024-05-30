import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/drizzle";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        {
          message: "id is necessary.",
          success: false,
          data: {},
        },
        { status: 200 }
      );
    }

    const dbBlog = await db.query.blog.findFirst({
      where: (blog, { eq }) => eq(blog.id, params.id),
    });

    return NextResponse.json(
      {
        message: "",
        success: true,
        data: { ...dbBlog },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while get blog list." },
      { status: 500 }
    );
  }
}
