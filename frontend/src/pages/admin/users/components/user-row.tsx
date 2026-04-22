import { Badge } from "@/components/ui/badge";
import AvatarCircle from "@/components/ui/avatar-circle";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow,TableCell } from "@/components/ui/table";
import type { IUser } from "@/types/user";

const UserRow = ({ user }: { user: IUser }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex gap-2 items-center">
          <AvatarCircle src={user?.image} name={user?.name} />
          <div className="flex flex-col">
            <span className="font-semibold">{user?.name}</span>
            <span className="">
              <span className="font-semibold text-xs">Role:</span> {user?.role}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold">{user?.email}</span>
          <span className="text-sm">
            <span className="font-semibold text-xs">Username:</span>{" "}
            {user?.username}
          </span>
        </div>
      </TableCell>
      <TableCell>{user?.accountStatus}</TableCell>
      <TableCell>
        <Badge variant={user?.isEmailVerified ? "default" : "destructive"}>
          {user?.isEmailVerified ? "Verify" : "Not Verify"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Eye size={16} className="text-primary" />
          <Edit size={16} className="text-primary" />
          <Trash2 size={16} className="text-destructive" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
