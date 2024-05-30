import { NextResponse, type NextRequest } from "next/server";
import { count, eq, desc } from "drizzle-orm";
import { adapterDB, db } from "@/drizzle";
import { blog as BlogSchema } from "@/drizzle/schema/blog";
import { getAuthSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const _dataBlog = await request.json();
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          message: "not login",
          success: false,
          status: 401,
          data: {},
        },
        { status: 200 }
      );
    }

    const id = crypto.randomUUID();

    await adapterDB
      .insert(BlogSchema)
      .values({ ..._dataBlog, id, userId: session.user.id });

    return NextResponse.json(
      {
        message: "created successfully.",
        success: true,
        data: {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while create a blog." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const _dataBlog = await request.json();
    if (!_dataBlog.id) {
      return NextResponse.json(
        {
          message: "missing id",
          success: false,
          data: {},
        },
        { status: 200 }
      );
    }

    await adapterDB
      .update(BlogSchema)
      .set({ ..._dataBlog })
      .where(eq(BlogSchema.id, _dataBlog.id));

    return NextResponse.json(
      {
        message: "updated successfully.",
        success: true,
        data: {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while patch a blog." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const _params = await request.json();
    if (!_params.id) {
      return NextResponse.json(
        {
          message: "id is necessary.",
          success: false,
          data: {},
        },
        { status: 200 }
      );
    }

    await adapterDB
      .delete(BlogSchema)
      .where(eq(BlogSchema.id, _params.id))
      .returning();

    return NextResponse.json(
      {
        message: "deleted successfully.",
        success: true,
        data: {},
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

export async function GET(request: NextRequest) {
  try {
    const _params = new URLSearchParams(new URL(request.url).search);
    const page = Number(_params.get("page")) || 1;
    const pageSize = Number(_params.get("pageSize")) || 20;

    const offset = (page - 1) * pageSize;

    const totalCountResult = await db
      .select({ value: count() })
      .from(BlogSchema);

    const totalCount = totalCountResult[0]?.value;

    const dbBlogList = await db
      .select()
      .from(BlogSchema)
      .orderBy(desc(BlogSchema.createdAt))
      .limit(pageSize)
      .offset(offset)
      .execute();

    return NextResponse.json(
      {
        message: "",
        success: true,
        data: {
          totalCount,
          page,
          pageSize,
          list: dbBlogList,
        },
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
