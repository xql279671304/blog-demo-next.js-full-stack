import { NextResponse, type NextRequest } from "next/server";
import { adapterDB, db } from "@/drizzle";
import { count, eq, desc } from "drizzle-orm";
import * as AuthSchema from "@/drizzle/schema/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    const dbUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (dbUser) {
      return NextResponse.json(
        {
          message: "User existed.",
          success: false,
          data: {},
        },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    await adapterDB.insert(AuthSchema.user).values({
      id,
      name,
      email,
      password: hashedPassword,
    } as any);

    return NextResponse.json(
      {
        message: "User registered.",
        success: true,
        data: { name, email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
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
      .delete(AuthSchema.user)
      .where(eq(AuthSchema.user.id, _params.id))
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
      .from(AuthSchema.user);

    const totalCount = totalCountResult[0]?.value;

    const dbBlogList = await db
      .select()
      .from(AuthSchema.user)
      .orderBy(desc(AuthSchema.user.createdAt))
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
