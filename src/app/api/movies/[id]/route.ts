import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { watched } = body;

  try {
    const movie = await prisma.movie.update({
      where: { id: Number(id) },
      data: {
        watched,
        watchedAt: watched ? new Date() : null,
      },
    });
    return NextResponse.json(movie);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar filme" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.movie.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao remover filme" },
      { status: 500 },
    );
  }
}
