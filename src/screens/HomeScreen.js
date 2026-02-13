import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {useAuth} from '../context/AuthContext';

const logo = require('../assets/spherag2.png');
import {getFincas} from '../services/fincasService';

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

export default function HomeScreen({navigation}) {
  const {token, logout} = useAuth();
  const [fincas, setFincas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadFincas = useCallback(async () => {
    try {
      setError(null);
      const data = await getFincas(token);
      setFincas(data);
    } catch (e) {
      setError(e.message || 'Error al cargar las fincas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadFincas();
  }, [loadFincas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFincas();
  }, [loadFincas]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('AtlasList', {
          fincaId: item.id,
          fincaName: item.name,
        })
      }>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.favourite && <Text style={styles.star}>★</Text>}
      </View>
      <Text style={styles.cardDate}>
        Creada el {formatDate(item.createdDate)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={logout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#243677" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={fincas}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#243677',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 48,
  },
  headerSide: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerLogo: {
    width: 130,
    height: 36,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  list: {
    padding: 16,
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
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  star: {
    fontSize: 20,
    color: '#ffc107',
    marginLeft: 8,
  },
  cardDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
});
