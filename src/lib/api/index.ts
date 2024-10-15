import axios from "axios"

export interface TestResult {
  name: string
  status: string
  duration: number
  suite: string
  message?: string
}

export const downloadAllFiles = async () => {
    const files = [
        "objectstorage",
        "server",
        "vpc",
        "redis",
        "ses",
        "nks",
        "nasvolume",
        "mysql",
        "mssql",
        "mongodb",
        "loadbalancer",
        "hadoop",
        "autoscaling"
    ]

    let jsonList: TestResult[] = [];

    await Promise.all(files.map(async (file: string) => {
        try {
            const fileContent = await axios.get(`https://kr.object.ncloudstorage.com/test-dashboard/data/${file}-report.json`);
        
            if (!fileContent) return;

            if (jsonList.length === 0) {
                jsonList = fileContent.data.results.tests
                return;
            } 

            jsonList = [...jsonList, ...fileContent.data.results.tests]
        } catch (err) {
            console.error(err);
        }
    }));

    return jsonList;
}