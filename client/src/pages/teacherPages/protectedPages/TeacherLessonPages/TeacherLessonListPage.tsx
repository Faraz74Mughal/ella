import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { FaList, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

const TeacherLessonListPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Card className="py-4 ">
        <CardContent className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex gap-2 items-center"><FaList className="text-muted-foreground"/> All Lessons</h2>
          <Button onClick={() => navigate("/teacher/lessons/add")}>
            <FaPlus /> Create New Lesson
          </Button>
        </CardContent>
      </Card>
      <section className="bg-card rounded-lg overflow-hidden shadow">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default TeacherLessonListPage;
