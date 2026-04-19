import { Box, Link, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WhatsNewMarkdownContent = ({ content = "" }) => {
  return (
    <Box
      sx={{
        "& h1": {
          fontSize: "1.8rem",
          fontWeight: 800,
          mt: 0,
          mb: 2,
          lineHeight: 1.2,
        },
        "& h2": {
          fontSize: "1.35rem",
          fontWeight: 700,
          mt: 3,
          mb: 1.5,
          lineHeight: 1.3,
        },
        "& h3": {
          fontSize: "1.1rem",
          fontWeight: 700,
          mt: 2.5,
          mb: 1,
        },
        "& p": {
          margin: 0,
          marginBottom: "0.9rem",
          color: "text.secondary",
          lineHeight: 1.75,
        },
        "& ul, & ol": {
          margin: 0,
          marginBottom: "1rem",
          paddingLeft: "1.4rem",
          color: "text.secondary",
        },
        "& li": {
          marginBottom: "0.45rem",
          lineHeight: 1.7,
        },
        "& strong": {
          color: "text.primary",
          fontWeight: 700,
        },
        "& code": {
          fontFamily: "monospace",
          fontSize: "0.9em",
          px: 0.75,
          py: 0.2,
          borderRadius: 1,
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "primary.light",
        },
        "& pre": {
          margin: 0,
          marginBottom: "1rem",
          padding: "1rem",
          borderRadius: "16px",
          overflowX: "auto",
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid",
          borderColor: "divider",
        },
        "& pre code": {
          backgroundColor: "transparent",
          padding: 0,
          color: "inherit",
        },
        "& blockquote": {
          margin: 0,
          marginBottom: "1rem",
          paddingLeft: "1rem",
          borderLeft: "4px solid",
          borderColor: "primary.main",
          color: "text.secondary",
        },
        "& hr": {
          border: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          my: 2,
        },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1rem",
          overflow: "hidden",
          borderRadius: "12px",
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "divider",
          padding: "0.75rem",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: "rgba(255,255,255,0.04)",
          color: "text.primary",
          fontWeight: 700,
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              {children}
            </Link>
          ),
          p: ({ children }) => (
            <Typography component="p" variant="body2">
              {children}
            </Typography>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default WhatsNewMarkdownContent;