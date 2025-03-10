import { Link } from "react-router";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Alert,
  Container,
  Paper,
  Anchor
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

// User response schema
const userResponseSchema = z.array(
  z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string(),
    isAdmin: z.boolean(),
  })
).length(1);

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    validate: zodResolver(loginSchema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login attempt with:", data);
    
    try {
      setLoginError(null);
      
      const response = await fetch(
        `http://localhost:3000/users?username=${data.username}&password=${data.password}`
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const userData = await response.json();
      
      try {
        const validatedUser = userResponseSchema.parse(userData);
        localStorage.setItem("user", JSON.stringify(validatedUser[0]));
        navigate("/dashboard");
      } catch (error) {
        setLoginError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" mb="md">
          <Title order={2}>Login</Title>
          <Text size="sm" c="dimmed">
            Enter your credentials to access your account
          </Text>
        </Stack>
        
        {loginError && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            variant="filled" 
            mb="md"
          >
            {loginError}
          </Alert>
        )}
        
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="Enter your username"
              {...form.getInputProps('username')}
            />
            
            <PasswordInput
              required
              label="Password"
              placeholder="Enter your password"
              {...form.getInputProps('password')}
            />
            
            <Button type="submit" fullWidth mt="md">
              Sign in
            </Button>
          </Stack>
        </form>
        
        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/" size="sm">
            Back to Home
          </Anchor>
          <Anchor component={Link} to="/register" size="sm">
            Need an account? Register
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
}