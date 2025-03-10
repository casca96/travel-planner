import { Menu, Button } from "@mantine/core";
import { IconChevronDown, IconMap, IconLogout, IconDashboard, IconUsers } from "@tabler/icons-react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function NavigationMenu() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.isAdmin);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button rightSection={<IconChevronDown size={16} />} variant="light">
          Navigation
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item 
          component={Link} 
          to="/dashboard" 
          leftSection={<IconDashboard size={16} />}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item 
          component={Link} 
          to="/travel-plans" 
          leftSection={<IconMap size={16} />}
        >
          My Travel Plans
        </Menu.Item>
        
        {isAdmin && (
          <Menu.Item 
            component={Link} 
            to="/users" 
            leftSection={<IconUsers size={16} />}
          >
            User Management
          </Menu.Item>
        )}
        
        <Menu.Divider />
        <Menu.Item 
          color="red" 
          leftSection={<IconLogout size={16} />} 
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
} 