import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// ---- Mock data -------------------------------------------------------
const STAT_CARDS = [
  {
    key: "all",
    label: "All",
    value: 5,
    icon: <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />,
    iconBg: "bg-slate-600/60",
    iconColor: "text-slate-200",
  },
  {
    key: "pending",
    label: "Pending",
    value: 3,
    icon: <AccessTimeFilledIcon sx={{ fontSize: 20 }} />,
    iconBg: "bg-amber-500",
    iconColor: "text-slate-900",
  },
  {
    key: "submitted",
    label: "Submitted",
    value: 12,
    icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
    iconBg: "bg-emerald-500",
    iconColor: "text-slate-900",
  },
  {
    key: "overdue",
    label: "Overdue",
    value: 1,
    icon: <ErrorIcon sx={{ fontSize: 20 }} />,
    iconBg: "bg-red-600",
    iconColor: "text-white",
  },
];

const FILTERS = ["All", "Pending", "Submitted", "Overdue"];

const ASSIGNMENTS = [
  {
    name: "Build a REST API",
    course: "CS301 - Web Dev",
    due: "Oct 28, 11:59 PM",
    status: "PENDING",
    grade: "-",
  },
  {
    name: "Database Design ERD",
    course: "CS405 - Databases",
    due: "Oct 29, 10:00 AM",
    status: "PENDING",
    grade: "-",
  },
  {
    name: "Machine Learning Model Evaluation",
    course: "CS510 - AI",
    due: "Oct 25, 11:59 PM",
    status: "SUBMITTED",
    grade: "92/100",
  },
  {
    name: "React Performance Challenge",
    course: "CS301 - Web Dev",
    due: "Oct 24, 11:59 PM",
    status: "OVERDUE",
    grade: "-",
  },
  {
    name: "Midterm Essay Draft",
    course: "ENG201 - Lit",
    due: "Oct 20, 5:00 PM",
    status: "SUBMITTED",
    grade: "A-",
  },
];

const STATUS_STYLES = {
  PENDING: {
    color: "#fbbf24",
    bg: "rgba(217, 158, 21, 0.15)",
  },
  SUBMITTED: {
    color: "#34d399",
    bg: "rgba(16, 185, 129, 0.15)",
  },
  OVERDUE: {
    color: "#f87171",
    bg: "rgba(239, 68, 68, 0.15)",
  },
};

// ---- Component ---------------------------------------------------------
export default function Assignment() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  return (
    <Box
      className="min-h-screen w-full"
      sx={{
        bgcolor: "#0b1120",
        color: "#e2e8f0",
        fontFamily:
          '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <Box className="max-w-[1500px] mx-auto px-6 md:px-10 py-10">
        {/* Header */}
        <Typography
          variant="h4"
          className="!font-extrabold"
          sx={{ color: "#f8fafc", letterSpacing: "-0.02em", mb: 0.75 }}
        >
          Assignments
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Stay on top of your coursework and deadlines.
        </Typography>

        {/* Stat cards */}
        <Box className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((card) => (
            <Paper
              key={card.key}
              elevation={0}
              className="!rounded-2xl"
              sx={{
                bgcolor: "#141b2d",
                border: "1px solid #22293d",
                px: 3,
                py: 2.75,
              }}
            >
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography sx={{ color: "#94a3b8", fontSize: 14, mb: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{ color: "#f8fafc", fontSize: 32, fontWeight: 700 }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor}`}
                >
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Table panel */}
        <Paper
          elevation={0}
          className="!rounded-2xl overflow-hidden"
          sx={{ bgcolor: "#141b2d", border: "1px solid #22293d" }}
        >
          {/* Toolbar */}
          <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-5">
            <Box className="flex items-center gap-2 flex-wrap">
              {FILTERS.map((f) => {
                const active = f === activeFilter;
                return (
                  <Chip
                    key={f}
                    label={f}
                    onClick={() => setActiveFilter(f)}
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      px: 1,
                      height: 36,
                      bgcolor: active ? "#6366f1" : "#1c2438",
                      color: active ? "#ffffff" : "#cbd5e1",
                      "&:hover": {
                        bgcolor: active ? "#5457e5" : "#242c44",
                      },
                    }}
                  />
                );
              })}
            </Box>

            <Box
              className="flex items-center gap-2 rounded-xl px-3"
              sx={{
                bgcolor: "#0f1626",
                border: "1px solid #22293d",
                width: { xs: "100%", sm: 260 },
                height: 40,
              }}
            >
              <FilterListIcon sx={{ fontSize: 18, color: "#64748b" }} />
              <InputBase
                placeholder="Filter assignments..."
                sx={{
                  color: "#e2e8f0",
                  fontSize: 14,
                  width: "100%",
                  "& input::placeholder": { color: "#64748b", opacity: 1 },
                }}
              />
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ "& th": { borderBottom: "1px solid #22293d" } }}>
                  {["Name", "Course", "Due Date", "Status", "Grade"].map(
                    (h, i) => (
                      <TableCell
                        key={h}
                        align={i === 4 ? "right" : "left"}
                        sx={{
                          color: "#cbd5e1",
                          fontWeight: 700,
                          fontSize: 14,
                          py: 1.75,
                        }}
                      >
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {ASSIGNMENTS.map((a, idx) => {
                  const style = STATUS_STYLES[a.status];
                  return (
                    <TableRow
                      key={idx}
                      sx={{
                        "& td": {
                          borderBottom:
                            idx === ASSIGNMENTS.length - 1
                              ? "none"
                              : "1px solid #1e2740",
                        },
                        "&:hover": { bgcolor: "#171f33" },
                      }}
                    >
                      <TableCell sx={{ color: "#e2e8f0", fontSize: 15, py: 2.25 }}>
                        {a.name}
                      </TableCell>
                      <TableCell sx={{ color: "#94a3b8", fontSize: 14.5 }}>
                        {a.course}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: a.status === "OVERDUE" ? "#f87171" : "#94a3b8",
                          fontSize: 14.5,
                        }}
                      >
                        {a.due}
                      </TableCell>
                      <TableCell>
                        <Box
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                          sx={{ bgcolor: style.bg }}
                        >
                          <FiberManualRecordIcon
                            sx={{ fontSize: 8, color: style.color }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: style.color,
                              letterSpacing: "0.03em",
                            }}
                          >
                            {a.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#e2e8f0", fontSize: 14.5 }}>
                        {a.grade}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer / pagination */}
          <Box className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              Showing 1 to 5 of 16 entries
            </Typography>
            <Pagination
              count={3}
              page={page}
              onChange={(_, v) => setPage(v)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#cbd5e1",
                },
                "& .Mui-selected": {
                  bgcolor: "#6366f1 !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}