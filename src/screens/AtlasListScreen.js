import React, {useState, useEffect, useCallback, useRef} from 'react';
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

const PAGE_SIZE = 10;

function formatDate(dateString) {
  if (!dateString) {
    return '--';
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function AtlasListScreen({navigation, route}) {
  const {fincaId, fincaName} = route.params;
  const {token} = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loadAtlas = useCallback(
    async (page = 1, append = false) => {
      try {
        setError(null);
        const result = await getAtlasList(token, fincaId, page, PAGE_SIZE);
        const newItems = result?.items ?? [];

        if (append) {
          setItems(prev => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }

        setHasMore(newItems.length === PAGE_SIZE);
        pageRef.current = page;
      } catch (e) {
        setError(e.message || 'Error al cargar los dispositivos Atlas');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [token, fincaId],
  );

  useEffect(() => {
    loadAtlas(1);
  }, [loadAtlas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    loadAtlas(1);
  }, [loadAtlas]);

  const onEndReached = useCallback(() => {
    if (loadingMore || !hasMore) {
      return;
    }
    setLoadingMore(true);
    loadAtlas(pageRef.current + 1, true);
  }, [loadAtlas, loadingMore, hasMore]);

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
      <Text style={styles.cardName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.cardImei}>IMEI: {item.imei ?? '--'}</Text>
      <Text style={styles.cardDate}>
        Expira: {formatDate(item.expirationDate)}
      </Text>
      <View style={styles.cardStats}>
        <Text style={styles.stat}>Bateria: {item.battery ?? '--'}%</Text>
        <Text style={styles.stat}>Senal: {item.signal ?? '--'}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#243677" />
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
      data={items}
      keyExtractor={item => String(item.imei)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            style={styles.footer}
            size="small"
            color="#243677"
          />
        ) : null
      }
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
    backgroundColor: '#243677',
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
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  cardImei: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
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
  footer: {
    paddingVertical: 16,
  },
});
