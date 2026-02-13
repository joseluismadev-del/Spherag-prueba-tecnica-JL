import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {getAtlasDetail} from '../services/atlasService';

function DetailRow({label, value}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '--'}</Text>
    </View>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return '--';
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function AtlasDetailScreen({route}) {
  const {fincaId, imei} = route.params;
  const {token} = useAuth();
  const [atlas, setAtlas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDetail = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getAtlasDetail(token, fincaId, imei);
      setAtlas(result);
    } catch (e) {
      setError(e.message || 'Error al cargar el detalle del Atlas');
    } finally {
      setLoading(false);
    }
  }, [token, fincaId, imei]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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
        <TouchableOpacity style={styles.retryButton} onPress={loadDetail}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <DetailRow label="Nombre" value={atlas.name} />
        <DetailRow label="IMEI" value={atlas.imei} />
        <DetailRow label="ID" value={atlas.id} />
        <DetailRow
          label="Tipo"
          value={atlas.isAtlasTwo ? 'Atlas 2' : 'Atlas'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <DetailRow label="Estado" value={atlas.status} />
        <DetailRow
          label="Bateria"
          value={atlas.battery != null ? `${atlas.battery}%` : null}
        />
        <DetailRow
          label="Senal"
          value={atlas.signal != null ? `${atlas.signal}%` : null}
        />
        <DetailRow
          label="Fecha expiracion"
          value={formatDate(atlas.expirationDate)}
        />
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
