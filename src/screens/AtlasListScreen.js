import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {getAtlasList} from '../services/atlasService';

function StatusDot({status}) {
  const color =
    status === 'Online'
      ? '#4caf50'
      : status === 'Offline'
        ? '#f44336'
        : '#ff9800';
  return <View style={[styles.dot, {backgroundColor: color}]} />;
}

export default function AtlasListScreen({navigation, route}) {
  const {fincaId, fincaName} = route.params;
  const {token} = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadAtlas = useCallback(async () => {
    try {
      setError(null);
      const result = await getAtlasList(token, fincaId);
      setData(result);
    } catch (e) {
      setError(e.message || 'Error al cargar los dispositivos Atlas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, fincaId]);

  useEffect(() => {
    loadAtlas();
  }, [loadAtlas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAtlas();
  }, [loadAtlas]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('AtlasDetail', {
          fincaId,
          imei: item.imei,
          atlasName: item.name,
        })
      }>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <StatusDot status={item.status} />
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {item.isAtlasTwo && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Atlas 2</Text>
          </View>
        )}
      </View>
      <View style={styles.cardStats}>
        <Text style={styles.stat}>Bateria: {item.battery ?? '--'}%</Text>
        <Text style={styles.stat}>Senal: {item.signal ?? '--'}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.items ?? []}
      keyExtractor={item => String(item.imei)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No hay dispositivos Atlas en esta finca
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    color: '#1565c0',
    fontSize: 12,
    fontWeight: '600',
  },
  cardStats: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
  },
  stat: {
    fontSize: 14,
    color: '#666',
  },
});
