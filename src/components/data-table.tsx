import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: string;
  header: string;
  sortValue?: (row: T) => string | number;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  rows,
  columns,
  searchable,
  searchPlaceholder = "Search…",
  pageSize = 8,
  caption,
  emptyMessage = "No records match the current filters.",
  toolbar,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: (row: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  caption: string;
  emptyMessage?: string;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = !q || !searchable ? [...rows] : rows.filter((r) => searchable(r).toLowerCase().includes(q));
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        out.sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, query, sort, columns, searchable]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const visible = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div className="space-y-3">
      {(searchable || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchable ? (
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 max-w-xs bg-surface"
            />
          ) : null}
          {toolbar}
        </div>
      )}

      <div className="gov-panel overflow-x-auto">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow className="bg-muted/60">
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <TableHead key={col.key} className={col.className} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}>
                    {col.sortValue ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setSort((s) =>
                            s?.key === col.key ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: col.key, dir: "asc" },
                          )
                        }
                      >
                        {col.header}
                        <span aria-hidden="true">{active ? (sort!.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.header}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row, i) => (
                <TableRow
                  key={i}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p>
          Showing {visible.length} of {filtered.length} records
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
            Previous
          </Button>
          <span className="gov-data">
            Page {current + 1} / {pageCount}
          </span>
          <Button variant="outline" size="sm" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
