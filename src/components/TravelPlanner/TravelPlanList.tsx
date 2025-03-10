import { useEffect, useState } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { 
  Container, 
  Title, 
  Paper, 
  Button, 
  Group, 
  Table, 
  Text, 
  ActionIcon,
  Loader,
  Alert
} from "@mantine/core";
import { IconEdit, IconTrash, IconAlertCircle } from "@tabler/icons-react";
import NavigationMenu from "../NavigationMenu";

// Define the schema for travel plan data
const travelPlanSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    username: z.string()
  })
);

type TravelPlan = z.infer<typeof travelPlanSchema>[0];

export default function TravelPlanList() {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string, isAdmin: boolean } | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Error loading user data");
      }
    }
  }, []);

  useEffect(() => {
    const fetchTravelPlans = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Determine the URL based on user role
        const url = user.isAdmin 
          ? "http://localhost:3000/travel-plans"
          : `http://localhost:3000/travel-plans?username=${user.username}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch travel plans");
        }
        
        const data = await response.json();
        
        // Validate the response data with Zod
        const validatedData = travelPlanSchema.parse(data);
        setTravelPlans(validatedData);
      } catch (error) {
        console.error("Error fetching travel plans:", error);
        setError("Failed to load travel plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTravelPlans();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this travel plan?")) {
      try {
        const response = await fetch(`http://localhost:3000/travel-plans/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Failed to delete travel plan");
        }

        // Remove the deleted plan from the state
        setTravelPlans(travelPlans.filter(plan => plan.id !== id));
      } catch (error) {
        console.error("Error deleting travel plan:", error);
        setError("Failed to delete travel plan. Please try again.");
      }
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>My Travel Plans</Title>
        <Group>
          <NavigationMenu />
          <Button component={Link} to="/travel-plans/create" color="blue">
            Create New Plan
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red" 
          mb="md"
        >
          {error}
        </Alert>
      )}

      <Paper shadow="sm" p="md" withBorder>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader size="md" />
          </div>
        ) : travelPlans.length === 0 ? (
          <Text ta="center" py="xl" c="dimmed">
            No travel plans found. Create your first plan!
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Country</Table.Th>
                <Table.Th>Author</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {travelPlans.map((plan) => (
                <Table.Tr key={plan.id}>
                  <Table.Td style={{ textAlign: 'left' }}>{plan.name}</Table.Td>
                  <Table.Td style={{ textAlign: 'left' }}>{plan.country}</Table.Td>
                  <Table.Td style={{ textAlign: 'left' }}>{plan.username}</Table.Td>
                  <Table.Td style={{ textAlign: 'left' }}>
                    <Group gap="xs">
                      <ActionIcon 
                        component={Link} 
                        to={`/travel-plans/edit/${plan.id}`} 
                        variant="subtle" 
                        color="blue"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        onClick={() => handleDelete(plan.id)} 
                        variant="subtle" 
                        color="red"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
} 