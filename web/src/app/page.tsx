"use client";

import Navbar from "../app/component/Navbar";
import { useEffect, useState } from "react";
import { useRequest } from "../app/lib/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const USERNAME = process.env.NEXT_PUBLIC_USERNAME || "";
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "";

interface FileInfo {
  name: string;
  folder: string;
  lastModified: string;
  size: number;
}

// Custom styled components for better spacing and aesthetics
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: "auto",
  backgroundColor: "#F8FAFC",
  minHeight: "100vh",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(6),
  color: "#1E293B",
  fontWeight: 600,
  fontSize: "1.5rem",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
}));

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await useRequest.get("/api/files");
        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          `Failed to load files: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (blobName: string) => {
    try {
      const response = await useRequest.get(
        `/api/download?blobName=${encodeURIComponent(blobName)}`
      );
      window.open(response.data.url, "_blank");
    } catch (err) {
      alert(
        `Failed to generate download link: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const handleLogin = () => {
    // Simulate a simple login (in a real-world scenario, you would authenticate with an API)
    if (username === `${USERNAME}` && password === `${PASSWORD}`) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } else {
      alert("Invalid credentials");
    }
  };

  // Filter and limit files for dev and staging
  const devFiles = files.filter((file) => file.folder === "dev").slice(0, 3);
  const stagingFiles = files
    .filter((file) => file.folder === "staging")
    .slice(0, 3);

  const renderTable = (files: FileInfo[], folder: string) => (
    <Box>
      <SectionTitle variant="h5">{folder}</SectionTitle>
      {files.length === 0 ? (
        <Typography sx={{ color: "#64748B" }}>
          No files found in {folder.toLowerCase()} folder.
        </Typography>
      ) : (
        <Paper sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>
                    File Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>
                    Size
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow
                    key={`${file.folder}/${file.name}`}
                    sx={{
                      "&:hover": { backgroundColor: "#F8FAFC" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "#334155" }}>{file.name}</TableCell>
                    <TableCell sx={{ color: "#64748B" }}>
                      {((file.size / 1024) * 0.001).toFixed(2)} MB
                    </TableCell>
                    <TableCell>
                      {isLoggedIn ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleDownload(`${file.folder}/${file.name}`)
                          }
                          sx={{
                            backgroundColor: "#6B46C1",
                            "&:hover": { backgroundColor: "#553C9A" },
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: "8px",
                            px: 2,
                          }}
                        >
                          Download
                        </Button>
                      ) : (
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="px-4 py-2 bg-transparent text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                        >
                          Log in to Download
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      )}
    </Box>
  );

  return (
    <Container>
      <Navbar />
      <Box sx={{ mt: 4 }}>
        {/* <Typography
          variant="h4"
          sx={{
            color: "#0F172A",
            fontWeight: 700,
            mb: 4,
            fontSize: "2.25rem",
          }}
        >
          Azure Blob Storage File Explorer
        </Typography> */}
        {renderTable(devFiles, "Dev")}
        {renderTable(stagingFiles, "Staging")}
      </Box>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-800/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handleLogin}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
