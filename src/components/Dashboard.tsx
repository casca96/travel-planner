import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Title, Paper, Text, Group, Box, Loader } from "@mantine/core";
import NavigationMenu from "./NavigationMenu";

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      // Parse user data from localStorage
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader size="lg" />
      </Box>
    );
  }

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Dashboard</Title>
        <NavigationMenu />
      </Group>

      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Title order={2} size="h3" mb="md">Welcome, {user.username}!</Title>
        <Box>
          <Text mb="xs"><Text span fw={600}>Email:</Text> {user.email}</Text>
          <Text><Text span fw={600}>Role:</Text> {user.isAdmin ? "Administrator" : "User"}</Text>
        </Box>
      </Paper>
    </Container>
  );
} 