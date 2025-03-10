import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  Button, 
  Container, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Paper, 
  Textarea,
  Select,
  Alert,
  Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from "@tabler/icons-react";
import NavigationMenu from "../NavigationMenu";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
});

type FormValues = z.infer<typeof formSchema>;

// Sample list of countries (you can expand this)
const countries = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'China', label: 'China' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'India', label: 'India' },
];

export default function TravelPlanGenerator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      description: "",
      country: "",
    },
  });

  useEffect(() => {
    // If in edit mode, fetch the travel plan data
    if (isEditMode && loading) {
      const fetchTravelPlan = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`http://localhost:3000/travel-plans/${id}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch travel plan");
          }
          
          const data = await response.json();

          // Update form with fetched data
          form.setValues({
            name: data.name,
            description: data.description || "",
            country: data.country,
          });
        } catch (error) {
          console.error("Error fetching travel plan:", error);
          setError("Failed to load travel plan data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchTravelPlan();
    }
  }, [id, isEditMode, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      
      // Get current user from localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(userData);
      
      // Prepare the data to send
      const travelPlanData = {
        ...data,
        username: user.username,
      };
      
      // Determine if this is a create or update operation
      const url = isEditMode 
        ? `http://localhost:3000/travel-plans/${id}`
        : "http://localhost:3000/travel-plans";
      
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(travelPlanData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} travel plan`);
      }

      notifications.show({
        title: `Travel plan ${isEditMode ? "updated" : "created"}`,
        message: `Your travel plan has been successfully ${isEditMode ? "updated" : "created"}.`,
        color: 'green',
      });
      
      navigate("/travel-plans");
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} travel plan:`, error);
      setError(`Failed to ${isEditMode ? "update" : "create"} travel plan. Please try again.`);
    }
  };
  
  if (loading) {
    return (
      <Container size="xs" py="xl">
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <Loader size="md" />
        </div>
      </Container>
    );
  }
  
  return (
    <Container size="xs" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>{isEditMode ? "Edit Travel Plan" : "Create Travel Plan"}</Title>
        <NavigationMenu />
      </Group>
      
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" mb="md">
          <Text size="sm" c="dimmed">
            {isEditMode 
              ? "Update your travel plan details" 
              : "Fill in the details to create a new travel plan"}
          </Text>
        </Stack>
        
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
        
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Enter a name for your travel plan"
              {...form.getInputProps('name')}
            />
            
            <Textarea
              required
              label="Description"
              placeholder="Describe your travel plan"
              minRows={3}
              {...form.getInputProps('description')}
            />
            
            <Select
              required
              label="Country"
              placeholder="Select a country"
              data={countries}
              searchable
              {...form.getInputProps('country')}
            />
            
            <Button type="submit" fullWidth mt="md">
              {isEditMode ? "Update Travel Plan" : "Create Travel Plan"}
            </Button>
          </Stack>
        </form>
        
        <Group justify="center" mt="md">
          <Button component={Link} to="/travel-plans" variant="subtle">
            Back to Travel Plans
          </Button>
        </Group>
      </Paper>
    </Container>
  );
} 