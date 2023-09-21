'use client'

import { PlusIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import { BillboardColumn, columns } from "./columns"

interface BillboardsClientProps {
  data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardsClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage your store Billboards"
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data}/>
      <Heading title="API" description="API call for Billoards" />
      <Separator />
      <ApiList entityName="billboards" entityId="billboardId" />
    </>
  )
}
