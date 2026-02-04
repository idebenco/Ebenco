import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { propertyService } from '../services';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetailScreen({ route, navigation }) {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const data = await propertyService.getProperty(propertyId);
      setProperty(data.property);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    navigation.navigate('ApplyProperty', { property });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centered}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {property.images && property.images.length > 0 && (
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">{property.title}</Text>
          
          <Text variant="headlineSmall" style={styles.price}>
            ${property.price}/month
          </Text>

          <View style={styles.badges}>
            <Chip icon="bed" style={styles.chip}>
              {property.bedrooms} Bedrooms
            </Chip>
            <Chip icon="shower" style={styles.chip}>
              {property.bathrooms} Bathrooms
            </Chip>
            {property.squareFeet && (
              <Chip icon="ruler-square" style={styles.chip}>
                {property.squareFeet} sq ft
              </Chip>
            )}
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Address
          </Text>
          <Text variant="bodyLarge">
            {property.address.street}
          </Text>
          <Text variant="bodyLarge">
            {property.address.city}, {property.address.state} {property.address.zipCode}
          </Text>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="bodyMedium">{property.description}</Text>

          {property.amenities && property.amenities.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Amenities
              </Text>
              <View style={styles.amenities}>
                {property.amenities.map((amenity, index) => (
                  <Chip key={index} mode="outlined" style={styles.amenityChip}>
                    {amenity}
                  </Chip>
                ))}
              </View>
            </>
          )}

          {user?.role === 'tenant' && property.status === 'available' && (
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
              icon="file-document"
            >
              Apply for this Property
            </Button>
          )}

          {user?.role === 'landlord' &&
            property.landlordId._id === user._id && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('EditProperty', { property })}
                style={styles.editButton}
                icon="pencil"
              >
                Edit Property
              </Button>
            )}
        </Card.Content>
      </Card>
    </ScrollView>
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
  },
  image: {
    width: '100%',
    height: 250,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  price: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  applyButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
