import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Col<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  pageSize = 5,
  empty = "No data",
}: {
  columns: Col<T>[];
  rows: T[];
  pageSize?: number;
  empty?: string;
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = page * pageSize;
  const slice = rows.slice(start, start + pageSize);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border/70 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60 border-b border-border/70">
              {columns.map((c) => (
                <TableHead key={c.key} className={cn("h-11 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground", c.className)}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">{empty}</TableCell></TableRow>
            ) : slice.map((row, i) => (
              <TableRow key={i} className="hover:bg-accent/40 transition-colors">
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>{c.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing {rows.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">Page {page + 1} / {pageCount}</span>
          <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
