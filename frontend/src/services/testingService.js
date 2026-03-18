import axios from "axios";

const testingClient = axios.create({
  baseURL: "http://localhost:8080/api/testing",
  timeout: 120000,
});

export async function startProjectTest(repositoryUrl) {
  const response = await testingClient.post("/run", { repositoryUrl });
  return response.data;
}

export async function fetchTestJobs() {
  const response = await testingClient.get("/jobs");
  return response.data;
}

export async function fetchTestJob(jobId) {
  const response = await testingClient.get(`/jobs/${jobId}`);
  return response.data;
}
