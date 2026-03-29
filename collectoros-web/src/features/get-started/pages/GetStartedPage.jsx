import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/useAuth";
import GuideHero from "../components/GuideHero";
import ModulesSection from "../components/ModulesSection";
import QuickStartSteps from "../components/QuickStartSteps";
import TipsSection from "../components/TipsSection";

const GetStartedPage = () => {
  const { user } = useAuth();

  return (
    <Stack spacing={4}>
      <GuideHero />

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              How CollectorOS works
            </Typography>

            <Typography variant="body1" color="text.secondary">
              CollectorOS is designed to help you manage what you already own,
              keep track of items you want next, and understand your collection
              through analytics and summaries.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <ModulesSection isAdmin={user?.role === "admin"} />

      <QuickStartSteps />

      <TipsSection />
    </Stack>
  );
};

export default GetStartedPage;