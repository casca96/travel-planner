import { useEffect, useState } from "react";
import { z } from "zod";
import { 
  Container, 
  Title, 
  Paper, 
  Group, 
  Table, 
  Text, 
  ActionIcon,
  Loader,
  Alert
} from "@mantine/core";
import { IconTrash, IconAlertCircle } from "@tabler/icons-react";
import NavigationMenu from "./NavigationMenu";
import { useNavigate } from "react-router";

// Define the schema for user data
const userSchema = z.array(
  z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    isAdmin: z.boolean()
  })
);

type User = z.infer<typeof userSchema>[0];

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ isAdmin: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        
        // Redirect non-admin users
        if (!parsedUser.isAdmin) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Error loading user data");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?.isAdmin) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:3000/users?isAdmin=false");
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        
        // Validate the response data with Zod
        const validatedData = userSchema.parse(data);
        setUsers(validatedData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        // Remove the deleted user from the state
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  if (!currentUser?.isAdmin) {
    return null; // Don't render anything for non-admin users
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>User Management</Title>
        <NavigationMenu />
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
        ) : users.length === 0 ? (
          <Text ta="center" py="xl" c="dimmed">
            No users found.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Username</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td style={{ textAlign: 'left' }}>{user.username}</Table.Td>
                  <Table.Td style={{ textAlign: 'left' }}>{user.email}</Table.Td>
                  <Table.Td style={{ textAlign: 'left' }}>
                    <ActionIcon 
                      onClick={() => handleDelete(user.id)} 
                      variant="subtle" 
                      color="red"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
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