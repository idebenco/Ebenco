import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, ActivityIndicator, Searchbar, Button } from 'react-native-paper';
import { propertyService } from '../services';

export default function PropertiesScreen({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProperties = useCallback(async () => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await propertyService.getProperties(params);
      setProperties(data.properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  const renderProperty = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('PropertyDetail', { propertyId: item._id })}
    >
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium" style={styles.address}>
          {item.address.street}, {item.address.city}, {item.address.state}
        </Text>
        <View style={styles.row}>
          <Text variant="headlineSmall" style={styles.price}>
            ${item.price}/month
          </Text>
          <View style={styles.badges}>
            <Chip icon="bed" compact style={styles.chip}>
              {item.bedrooms}
            </Chip>
            <Chip icon="shower" compact style={styles.chip}>
              {item.bathrooms}
            </Chip>
          </View>
        </View>
        <Chip
          mode="flat"
          style={[
            styles.statusChip,
            item.status === 'available' && styles.availableChip,
          ]}
        >
          {item.status.toUpperCase()}
        </Chip>
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
      <Searchbar
        placeholder="Search properties..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No properties found</Text>
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
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  address: {
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  badges: {
    flexDirection: 'row',
  },
  chip: {
    marginLeft: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  availableChip: {
    backgroundColor: '#4CAF50',
  },
});
