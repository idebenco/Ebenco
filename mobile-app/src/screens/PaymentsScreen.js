import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { paymentService } from '../services';

export default function PaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getPayments();
      setPayments(data.payments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      case 'refunded':
        return '#9E9E9E';
      default:
        return '#FF9800';
    }
  };

  const getTypeLabel = (type) => {
    return type.replace('_', ' ').toUpperCase();
  };

  const renderPayment = ({ item }) => {
    const isPastDue =
      item.status === 'pending' && new Date(item.dueDate) < new Date();

    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate('PaymentDetail', { paymentId: item._id })
        }
      >
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleLarge">${item.amount}</Text>
            <Chip mode="outlined">{getTypeLabel(item.type)}</Chip>
          </View>
          <Text variant="bodyMedium" style={styles.property}>
            {item.propertyId?.title || 'Property'}
          </Text>
          <View style={styles.row}>
            <Text variant="bodySmall" style={isPastDue && styles.pastDue}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
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
          {item.paidAt && (
            <Text variant="bodySmall" style={styles.paidDate}>
              Paid: {new Date(item.paidAt).toLocaleDateString()}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

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
        data={payments}
        renderItem={renderPayment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No payments found</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  property: {
    color: '#666',
    marginBottom: 8,
  },
  pastDue: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  paidDate: {
    color: '#4CAF50',
    marginTop: 4,
  },
});
