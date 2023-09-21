"use client"

import { Button } from "@/components/ui/button";
import { CategoryColumn } from "./columns";
import { CopyIcon, EditIcon, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Category Id successfully copied.")
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      router.refresh();
      toast.success('Category Deleted.');
    } catch (error) {
      toast.error("Make sure you have removed all product using this category.");
    } finally {
      setLoading(false);
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => onCopy(data.id)}>
          <CopyIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
