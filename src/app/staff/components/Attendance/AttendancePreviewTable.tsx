"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AttendancePreviewTable({ students = [] }: any) {
  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="font-semibold mb-3">Students (Initial: Absent)</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.rollNumber}</TableCell>
              <TableCell><span className="text-red-500 font-semibold">Absent (default)</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
