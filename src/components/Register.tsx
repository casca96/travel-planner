import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Container, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Anchor, 
  Paper 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  isAdmin: z.literal(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
    const navigate = useNavigate();
    
    const form = useForm<FormValues>({
        validate: zodResolver(formSchema),
        initialValues: {
            email: "",
            username: "",
            password: "",
            isAdmin: false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            notifications.show({
                title: 'Registration successful',
                message: 'Your account has been created. Please log in.',
                color: 'green',
            });
            
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            
            // Show error notification
            notifications.show({
                title: 'Registration failed',
                message: 'There was a problem creating your account.',
                color: 'red',
            });
        }
    };
    
    return (
        <Container size="xs" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <Stack align="center" mb="md">
                    <Title order={2}>Register</Title>
                    <Text size="sm" c="dimmed">
                        Create a new account to get started
                    </Text>
                </Stack>
                
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="Enter your email"
                            {...form.getInputProps('email')}
                        />
                        
                        <TextInput
                            required
                            label="Username"
                            placeholder="Choose a username"
                            {...form.getInputProps('username')}
                        />
                        
                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Create a password"
                            {...form.getInputProps('password')}
                        />
                        
                        <Button type="submit" fullWidth mt="md">
                            Create Account
                        </Button>
                    </Stack>
                </form>
                
                <Group justify="space-between" mt="md">
                    <Anchor component={Link} to="/" size="sm">
                        Back to Home
                    </Anchor>
                    <Anchor component={Link} to="/login" size="sm">
                        Already have an account? Login
                    </Anchor>
                </Group>
            </Paper>
        </Container>
    );
}