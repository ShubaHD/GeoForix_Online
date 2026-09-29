import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { ROLES, type Role } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 401;
    return NextResponse.json(
      { error: status === 403 ? "Doar admin" : "Neautentificat" },
      { status },
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 401;
    return NextResponse.json(
      { error: status === 403 ? "Doar admin" : "Neautentificat" },
      { status },
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "FIELD").toUpperCase() as Role;

  if (!email || !name || !password) {
    return NextResponse.json(
      { error: "Nume, email și parolă sunt obligatorii" },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Parola trebuie să aibă cel puțin 6 caractere" },
      { status: 400 },
    );
  }
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol invalid" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email-ul există deja" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash: await hashPassword(password),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
