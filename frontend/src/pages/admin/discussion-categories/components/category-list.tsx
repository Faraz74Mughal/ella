import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IDiscussionCategory } from "@/types/discussion";

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(new Date(value));
};

const CategoryList = ({ categories }: { categories: IDiscussionCategory[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category._id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">{category.description || "—"}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(category.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryList;
