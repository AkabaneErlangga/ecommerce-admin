import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  const body = await req.json();

  const {external_id, status} = body;

  if (status === 'PAID') {
    const order = await prismadb.order.update({
      where: {
        id: external_id,
      },
      data: {
        isPaid: true,
      },
      include: {
        orderItems: true,
      }
    })

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds]
        }
      },
      data: {
        isArchived: true
      }
    })
  }
  
  return NextResponse.json({status: 200})
}