import { Link } from "react-router";
import { Button, Card, Text, Title, Container, Group, Stack, Box, Divider } from '@mantine/core';

export default function Home() {
    return (
        <Box className="min-h-screen flex flex-col items-center justify-center p-6">
            <Container size="md" p={0}>
                <Card shadow="md" padding="lg" radius="md" withBorder>
                    <Stack align="center" spacing="xs">
                        <Title order={1} c="blue.7" ta="center">Travel Planner</Title>
                        <Text size="lg" c="dimmed" ta="center">
                            Your personal assistant for creating unforgettable journeys
                        </Text>
                    </Stack>

                    <Stack spacing="xl" my="xl" ta="center">
                        <Text>
                            Plan your trips with ease, discover amazing destinations, and keep all your travel details organized in one place.
                        </Text>
                        
                        <Group justify="center" mt="lg">
                            <Button component={Link} to="/login">
                                Login
                            </Button>
                            <Button component={Link} to="/register" variant="outline" color="blue">
                                Register
                            </Button>
                        </Group>
                    </Stack>

                    <Divider my="sm" />
                    <Text size="sm" c="dimmed" ta="center" py="xs">
                        © 2025 Travel Planner App. All rights reserved.
                    </Text>
                </Card>
            </Container>
        </Box>
    );
}