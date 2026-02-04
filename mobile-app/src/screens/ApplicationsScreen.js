import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import { applicationService } from '../services';
import { useAuth } from '../context/AuthContext';

export default function ApplicationsScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const renderApplication = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('ApplicationDetail', { applicationId: item._id })
      }
    >
      <Card.Content>
        <Text variant="titleLarge">
          {item.propertyId?.title || 'Property'}
        </Text>
        <Text variant="bodyMedium" style={styles.address}>
          {item.propertyId?.address?.city}, {item.propertyId?.address?.state}
        </Text>
        {user?.role !== 'tenant' && (
          <Text variant="bodyMedium" style={styles.tenant}>
            Applicant: {item.tenantId?.profile?.firstName}{' '}
            {item.tenantId?.profile?.lastName}
          </Text>
        )}
        <View style={styles.row}>
          <Text variant="bodySmall">
            Applied: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) },
            ]}
            textStyle={{ color: 'white' }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        renderItem={renderApplication}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No applications found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  address: {
    color: '#666',
    marginTop: 4,
  },
  tenant: {
    marginTop: 4,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
});
