import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "./ui/table";
import { TestResult } from "@/lib/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function IndivTableRow({
  result,
  index,
}: {
  result: TestResult;
  index: number;
}) {
  return (
    <TableRow key={index}>
      <TableCell>
        <Badge variant={result.status === "passed" ? "success" : "destructive"}>
          {result.status === "passed" ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <XCircle className="w-4 h-4 mr-1" />
          )}
          {result.status}
        </Badge>
      </TableCell>
      <TableCell>{result.name}</TableCell>
      <TableCell>
        <Clock className="w-4 h-4 inline mr-1" />
        {result.duration}
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {result.suite.split("/")[result.suite.split("/").length - 1]}
      </TableCell>
      {result.message && (
        <TableCell className="text-sm text-gray-500">
          {result.message}
        </TableCell>
      )}
    </TableRow>
  );
}
