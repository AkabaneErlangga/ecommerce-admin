import {format} from "date-fns"
import prismadb from "@/lib/prismadb"
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

const ProductPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formatedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'dd MMMM yyyy')
  })
  )

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  )
}

export default ProductPage 