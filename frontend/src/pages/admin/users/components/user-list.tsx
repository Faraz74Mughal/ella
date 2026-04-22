import React from "react";
import type { IUser } from "@/types/user";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRow from "./user-row";

const UserList = ({ users }: { users: IUser[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Is Verified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {((users as IUser[]) || []).map((user: IUser) => (
          <UserRow key={user._id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
