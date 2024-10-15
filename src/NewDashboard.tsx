import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { downloadAllFiles, TestResult } from "./lib/api";
import IndivTableRow from "./components/IndivTableRow";

interface SuiteStatus {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  status: "passed" | "failed";
}

export default function TestResultsDashboard() {
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("details");
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const filteredResults = testResults.filter((result) => {
    if (filter === "all") return true;
    return result.status === filter;
  });

  const suiteStatuses: SuiteStatus[] = useMemo(() => {
    const suiteMap = new Map<string, SuiteStatus>();
    testResults.forEach((result) => {
      const suiteName =
        result.suite.split("/")[result.suite.split("/").length - 1];
      if (!suiteMap.has(suiteName)) {
        suiteMap.set(suiteName, {
          name: suiteName,
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          status: "passed",
        });
      }

      const suiteStatus = suiteMap.get(suiteName)!;
      suiteStatus.totalTests++;
      if (result.status === "passed") {
        suiteStatus.passedTests++;
      } else {
        suiteStatus.failedTests++;
        suiteStatus.status = "failed";
      }
    });

    return Array.from(suiteMap.values());
  }, [testResults]);

  const totalTestsCount = useMemo(() => {
    return suiteStatuses.reduce((acc, suite) => acc + suite.totalTests, 0);
  }, [suiteStatuses]);

  const passedTestsCount = useMemo(() => {
    return suiteStatuses.reduce((acc, suite) => acc + suite.passedTests, 0);
  }, [suiteStatuses]);

  const failedTestsCount = useMemo(() => {
    return suiteStatuses.reduce((acc, suite) => acc + suite.failedTests, 0);
  }, [suiteStatuses]);

  useEffect(() => {
    (async () => {
      const res = await downloadAllFiles();
      setTestResults(res);
    })();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Test Results Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalTestsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Passed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">
              {passedTestsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">
              {failedTestsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={(passedTestsCount / totalTestsCount) * 100}
            className="w-full"
          />
          <div className="mt-2 text-sm text-gray-500">
            {((passedTestsCount / totalTestsCount) * 100).toFixed(2)}% tests
            passed
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="suites">Suite Status</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="mb-4">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              className="mr-2"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("passed")}
              variant={filter === "passed" ? "default" : "outline"}
              className="mr-2"
            >
              Passed
            </Button>
            <Button
              onClick={() => setFilter("failed")}
              variant={filter === "failed" ? "default" : "outline"}
            >
              Failed
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Duration (ms)</TableHead>
                    <TableHead>Suite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => (
                    <IndivTableRow result={result} index={index} />
                    // <TableRow key={index}>
                    //   <TableCell>
                    //     <Badge
                    //       variant={
                    //         result.status === "passed"
                    //           ? "success"
                    //           : "destructive"
                    //       }
                    //     >
                    //       {result.status === "passed" ? (
                    //         <CheckCircle className="w-4 h-4 mr-1" />
                    //       ) : (
                    //         <XCircle className="w-4 h-4 mr-1" />
                    //       )}
                    //       {result.status}
                    //     </Badge>
                    //   </TableCell>
                    //   <TableCell>{result.name}</TableCell>
                    //   <TableCell>
                    //     <Clock className="w-4 h-4 inline mr-1" />
                    //     {result.duration}
                    //   </TableCell>
                    //   <TableCell className="text-sm text-gray-500">
                    //     {
                    //       result.suite.split("/")[
                    //         result.suite.split("/").length - 1
                    //       ]
                    //     }
                    //   </TableCell>
                    // </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="suites">
          <Card>
            <CardHeader>
              <CardTitle>Suite Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Suite Name</TableHead>
                    <TableHead>Total Tests</TableHead>
                    <TableHead>Passed Tests</TableHead>
                    <TableHead>Failed Tests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suiteStatuses.map((suite, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge
                          variant={
                            suite.status === "passed"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {suite.status === "passed" ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 mr-1" />
                          )}
                          {suite.status === "passed"
                            ? "Passed"
                            : "Issues Detected"}
                        </Badge>
                      </TableCell>
                      <TableCell>{suite.name}</TableCell>
                      <TableCell>{suite.totalTests}</TableCell>
                      <TableCell className="text-green-500">
                        {suite.passedTests}
                      </TableCell>
                      <TableCell className="text-red-500">
                        {suite.failedTests}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
