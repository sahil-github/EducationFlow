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
      className="min-h-screen w-full font-[Manrope]"
      sx={{
        color: "#e2e8f0",
        fontFamily:
          '"Manrope", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <Box className="w-full max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Assignments
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Stay on top of your coursework and deadlines.
          </p>
        </div>

        {/* Stat cards */}
        <Box className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {STAT_CARDS.map((card) => (
            <Paper
              key={card.key}
              elevation={0}
              className="!rounded-2xl"
              sx={{
                bgcolor: "#141b2d",
                border: "1px solid #22293d",
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.75 },
              }}
            >
              <Box className="flex items-center justify-between">
                <Box className="min-w-0 flex-1">
                  <Typography sx={{ color: "#94a3b8", fontSize: { xs: 12, sm: 14 }, mb: 0.5, truncate: true }}>
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{ color: "#f8fafc", fontSize: { xs: 22, sm: 32 }, fontWeight: 700 }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-xl shrink-0 ${card.iconBg} ${card.iconColor}`}
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
          <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5">
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
                      fontSize: { xs: 12, sm: 14 },
                      px: 0.5,
                      height: 32,
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
          <TableContainer sx={{ overflowX: "auto", width: "100%" }}>
            <Table sx={{ minWidth: 650 }}>
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
                          whiteSpace: "nowrap",
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
          <Box className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 gap-3">
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