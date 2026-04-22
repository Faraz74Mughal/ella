import PageHeading from "@/components/ui/page-heading";

import { Card } from "@/components/ui/card";

import TablePagination from "@/components/shared/table-pagination";
import { useState } from "react";
import type { IPagination } from "@/types/pagination";
import LessonList from "./components/lesson-list";
import { useGetLessonsByAdmin } from "@/hooks/use-lesson";

const AdminLessonsPage = () => {
  const [tableData, setTableData] = useState<IPagination>({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalPages: 1,
  });
  const { data: response } = useGetLessonsByAdmin(tableData);

  return (
    <section className="space-y-6">
      <PageHeading title="Lessons" createPageUrl="/admin/lessons/add" />
      <Card className="-py-2">
        <LessonList lessons={response?.lessons || []} />

        <TablePagination
          currentPage={response?.pagination?.currentPage || 1}
          totalPages={response?.pagination?.totalPages || 1}
          onPageChange={(page) =>
            setTableData((prev) => ({ ...prev, currentPage: page }))
          }
          onPerPageSelect={(perPage) =>
            setTableData((prev) => ({
              ...prev,
              limit: perPage,
              currentPage: 1,
            }))
          }
          perPage={tableData.limit}
        />
      </Card>
    </section>
  );
}

export default AdminLessonsPage;