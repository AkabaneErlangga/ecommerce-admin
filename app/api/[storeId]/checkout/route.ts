import prismadb from "@/lib/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const authToken = Buffer.from(
  `xnd_development_C8fpEIuGI4a9OAikOFrLG1niMUHN1dHCebu1MylkCVKavq3R7JMDOlqVSmInHr2:`
).toString("base64");

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { productIds, totalPrice, address, phone } = body;
  // const address = "surabaya jawa timur";
  // const phone = "089112323454";
  
  console.log(address);
  

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
      address: address,
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

  try {
    const { data, status } = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: order.id,
        amount: totalPrice,
        currency: "IDR",
        success_redirect_url: "http://localhost:3001/cart?success=1",
        failure_redirect_url: "http://localhost:3001/cart?failure=1",
      },
      {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      }
    );

    // console.log(`Response returned with a status of ${status}`);

    const { invoice_url } = data;

    // console.log(`Invoice created! Visit ${invoice_url} to complete payment`);
    return NextResponse.json(
      { url: invoice_url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    // console.log("Request failed", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}