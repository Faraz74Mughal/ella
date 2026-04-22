import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRow from "./lesson-row";
import type { ILesson } from "@/types/lesson";
import { useNavigate } from "react-router-dom";

const LessonList = ({ lessons }: { lessons: ILesson[] }) => {

  const navigate = useNavigate()

  const editNavigateHandler =(id:string)=>{
    navigate(`/admin/lessons/edit/${id}`)
  }


  const handleDelete =(id:string)=>{
    console.log("id",id);
    
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Is Publish</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {((lessons as ILesson[]) || []).map((user: ILesson) => (
          <UserRow key={user._id} lesson={user} onEdit={()=>editNavigateHandler(user?._id)} onDelete={()=>handleDelete(user._id)} />
        ))}
      </TableBody>
    </Table>
  );
};

export default LessonList;
