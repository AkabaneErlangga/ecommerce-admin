import prismadb from "@/lib/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const authToken = Buffer.from(`${process.env.XENDIT_API_KEY}:`).toString(
  "base64"
);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { productIds, totalPrice, address, phone, province, city, district, postalCode } =
    body;

  const addressComponents = [address, district, city, province, postalCode];
  const fullAddress = addressComponents.filter((c) => c !== null).join(", ");

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product id is required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      address: fullAddress,
      phone: phone,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  console.log(process.env.FRONTEND_URL);  

  try {
    const { data, status } = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: order.id,
        amount: totalPrice,
        currency: "IDR",
        success_redirect_url: `${process.env.FRONTEND_URL}/cart?success=1`,
        failure_redirect_url: `${process.env.FRONTEND_URL}/cart?failure=1`,
      },
      {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      }
    );

    const { invoice_url } = data;

    return NextResponse.json(
      { url: invoice_url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
