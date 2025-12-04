"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Download, X } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/DataTable";
import { Faculty } from "@/interface";
import GlobalPagination from "@/components/global/GlobalPagination";

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const debounceSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchFaculties();
  }, [page, limit]);

  useEffect(() => {
    setPage(1);

    if (page === 1) {
      fetchFaculties();
    }
  }, [debounceSearch]);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debounceSearch) params.append("search", debounceSearch);

      const res = await axios.get(`/api/faculty?${params.toString()}`);
      const data = res.data;
      setFaculties(data?.data || []);
      setTotal(data?.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/faculty");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "faculties.csv";
      a.click();
    } catch (error) {
      console.error("Failed to export:", error);
    } finally {
      setExporting(false);
    }
  };

  const facultyColumns: ColumnDef<Faculty>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "courses",
      header: "Assigned Courses",
      cell: ({ row }) => <div>{row.original?.courses?.length || 0}</div>,
    },
  ];

  const hasActiveFilters = search !== "";

  return (
    <main className="p-4 space-y-3">
      <PageHeader
        title="Faculty Management"
        subtitle="Manage and monitor all faculty members"
        buttons={
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        }
      />

      <Card className="mb-4">
        <CardHeader className="gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Find faculty members by name, email, or department
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Search
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faculty List</CardTitle>
          <CardDescription>Total: {total} faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable
              loading={loading}
              limit={limit}
              columns={facultyColumns}
              data={faculties}
            />
            <GlobalPagination
              itemsPerPage={limit}
              currentPage={page}
              totalItems={total}
              onPageChange={(page, limit) => {
                setPage(page);
                setLimit(limit);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
