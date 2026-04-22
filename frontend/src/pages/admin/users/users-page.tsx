import PageHeading from "@/components/ui/page-heading";
import { useGetUsersByAdmin } from "@/hooks/use-user";

import { Card } from "@/components/ui/card";

import TablePagination from "@/components/shared/table-pagination";
import { useState } from "react";
import type { IPagination } from "@/types/pagination";
import UserList from "./components/user-list";

const AdminUsersPage = () => {
  const [tableData, setTableData] = useState<IPagination>({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalPages: 1,
  });
  const { data: response } = useGetUsersByAdmin(tableData);

  return (
    <section className="space-y-6">
      <PageHeading title="Users" createPageUrl="/admin/users/add" />
      <Card className="-py-2">
        <UserList users={response?.users || []} />

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

export default AdminUsersPage;