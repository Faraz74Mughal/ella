import PageHeading from "@/components/ui/page-heading";

import { Card } from "@/components/ui/card";

import TablePagination from "@/components/shared/table-pagination";
import { useState } from "react";
import type { IPagination } from "@/types/pagination";
import ExerciseList from "./components/exercise-list";
import { useGetExercisesByAdmin } from "@/hooks/use-exercise";

const AdminExercisesPage = () => {
  const [tableData, setTableData] = useState<IPagination>({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalPages: 1,
  });
  const { data: response } = useGetExercisesByAdmin(tableData);

  return (
    <section className="space-y-6">
      <PageHeading title="Exercises" createPageUrl="/admin/exercises/add" />
      <Card className="-py-2">
        <ExerciseList exercises={response?.exercises || []} />

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

export default AdminExercisesPage;