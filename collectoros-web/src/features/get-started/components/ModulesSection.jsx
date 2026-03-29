import { Box, Typography } from "@mui/material";
import ModuleGuideCard from "./ModuleGuideCard";

const baseModules = [
  {
    title: "Dashboard",
    description:
      "See a quick overview of your collection, including key totals, recent activity, and high-level insights.",
    whenToUse:
      "Use Dashboard when you want a fast summary without going module by module.",
    nextStep:
      "Start here when you log in, then jump to Inventory or Wishlist depending on what you want to update.",
    actionLabel: "Open dashboard",
    to: "/dashboard",
  },
  {
    title: "Inventory",
    description:
      "Manage the items you already own, including quantity, condition, pricing, and collection details.",
    whenToUse:
      "Use Inventory whenever you add a new collectible, update item details, or review what is currently part of your collection.",
    nextStep:
      "If you are new to CollectorOS, this is usually the best place to begin.",
    actionLabel: "Open inventory",
    to: "/inventory",
  },
  {
    title: "Wishlist",
    description:
      "Keep track of the items you want to acquire later and organize your future collecting goals.",
    whenToUse:
      "Use Wishlist when you find something you want but do not own yet, or when you want to prioritize future purchases.",
    nextStep:
      "Add items here after your inventory is set up, so you can clearly separate owned items from future targets.",
    actionLabel: "Open wishlist",
    to: "/wishlist",
  },
  {
    title: "Analytics",
    description:
      "Review collection trends, value changes, and other metrics that help you understand your portfolio more clearly.",
    whenToUse:
      "Use Analytics once you already have enough data in your inventory and wishlist to make trends meaningful.",
    nextStep:
      "Visit this section regularly after updating your collection to see how it is evolving.",
    actionLabel: "Open analytics",
    to: "/analytics",
  },
];

const adminModule = {
  title: "Admin Users",
  description:
    "Manage user access, permissions, and account status across the system.",
  whenToUse:
    "Use this module when you need to grant access, review user roles, or manage active accounts.",
  nextStep:
    "This section is intended for administrators only.",
  actionLabel: "Open admin users",
  to: "/admin/users",
};

const ModulesSection = ({ isAdmin = false }) => {
  const modules = isAdmin ? [...baseModules, adminModule] : baseModules;

  return (
    <>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Main modules
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {modules.map((module) => (
          <Box key={module.title}>
            <ModuleGuideCard {...module} />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default ModulesSection;