import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Divider, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = () => {
    if (!user?.profile) return 'U';
    return `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={getInitials()} />
        <List.Item
          title={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`}
          description={user?.email}
          titleStyle={styles.name}
          style={styles.userInfo}
        />
      </View>

      <Divider />

      <List.Section>
        <List.Subheader>Account Information</List.Subheader>
        <List.Item
          title="Role"
          description={user?.role?.toUpperCase()}
          left={(props) => <List.Icon {...props} icon="account-badge" />}
        />
        <List.Item
          title="Phone"
          description={user?.profile?.phone}
          left={(props) => <List.Icon {...props} icon="phone" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Actions</List.Subheader>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="pencil" />}
          onPress={() => navigation.navigate('EditProfile')}
        />
        {user?.role === 'landlord' && (
          <List.Item
            title="My Properties"
            left={(props) => <List.Icon {...props} icon="home-city" />}
            onPress={() => navigation.navigate('MyProperties')}
          />
        )}
      </List.Section>

      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  userInfo: {
    marginTop: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutContainer: {
    padding: 16,
    marginTop: 24,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});
