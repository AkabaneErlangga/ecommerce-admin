'use client'

import { PlusIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import { SizeColumn, columns } from "./columns"

interface SizesClientProps {
  data: SizeColumn[]
}

export const SizeClient: React.FC<SizesClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage your store product Sizes"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data}/>
      <Heading title="API" description="API call for Billoards" />
      <Separator />
      <ApiList entityName="sizes" entityId="sizeId" />
    </>
  )
}
