import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IClassConfigurationResponse } from '@/types'
import Link from 'next/link'

interface ClassTableProps {
  classes: IClassConfigurationResponse[]
}

const ClassTable = ({ classes }: ClassTableProps) => {
  return (
    <Card className="border-[gray]/25">
      <CardHeader>
        <CardTitle>Classes Overview</CardTitle>
        <CardDescription>All classes with their information and assigned teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Level/Stream</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-black/70">
            {classes.map(cls => (
              <TableRow key={cls._id}>
                <TableCell className="font-medium">{cls.className}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {/* <Badge variant={cls.levelType === "primary" ? "default" : "secondary"}>
                      {cls.levelType.charAt(0).toUpperCase() + cls.levelType.slice(1)}
                    </Badge> */}
                    {cls.classSection && <p className="text-xs">{cls.classSection}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  {/* {cls.students?.length ?? "No Teacher"} */}

                  {cls.classTeacher && cls.classTeacher.length > 0 ? (
                    <div className="text-sm">
                      {cls.classTeacher.map((teacher, idx) => (
                        <div key={idx} className="font-medium">
                          {teacher.userId.firstName} {teacher.userId.lastName}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No Teacher</p>
                  )}
                </TableCell>
                <TableCell>{cls?.students?.length ?? 0}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="min-w-[80px]">
                    {cls?.subjects ? cls?.subjects.length : 0} subjects
                  </Badge>
                </TableCell>
                <TableCell>
                  {cls.students ? cls.students?.length : 0}
                  {/* <Badge variant="outline" className="min-w-[90px]">
                  </Badge> */}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/class/${cls._id}`}>
                    <Badge variant="secondary" className="rounded-[2px] p-2  font-normal cursor-pointer">
                      Manage
                    </Badge>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ClassTable
