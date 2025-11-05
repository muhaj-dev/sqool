import React from "react"
import * as z from "zod"
import { Trash2 } from "lucide-react"

import { formSchema } from "./ConfigurationForm"
interface SchoolItemProps extends z.infer<typeof formSchema> {
  onDelete: () => void
  onEdit: () => void
}
const SchoolItem: React.FC<SchoolItemProps> = ({
  classname,
  shortname,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between border mt-4 p-6 rounded-md  ">
      <div>
        <p>{shortname}</p>
        <p className="text-sm text-muted-foreground">{classname}</p>
      </div>
      <div className="flex items-center gap-4">
        <span
          className="text-primary p-2 rounded-md border cursor-pointer"
          onClick={onEdit}
        >
          Edit Information
        </span>
        <span className="border p-2 rounded-md">
          <Trash2
            className="hover:text-red-600 cursor-pointer"
            onClick={onDelete}
          />
        </span>
      </div>
    </div>
  );
}

export default SchoolItem
