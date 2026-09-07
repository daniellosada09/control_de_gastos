import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  // 📷 Cámara
  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Debes permitir acceso a la cámara');
      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: true,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🖼️ Galería
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Debes permitir acceso a la galería');
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: true,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 📍 GPS
  const getLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Debes permitir acceso a ubicación');
      return;
    }

    const currentLocation =
      await Location.getCurrentPositionAsync({});

    const latitude =
      currentLocation.coords.latitude;

    const longitude =
      currentLocation.coords.longitude;

    setLocation(
      `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
    );

    alert('📍 Ubicación obtenida');
  };

  // 💾 Guardar gasto REAL
  const saveExpense = async () => {
    if (!title || !amount || !category) {
      alert('⚠️ Llena todos los campos');
      return;
    }

    try {
      const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        category,
        image,
        location,
        createdAt: new Date().toISOString(),
      };

      // leer gastos guardados
      const storedExpenses =
        await AsyncStorage.getItem('expenses');

      const expenses = storedExpenses
        ? JSON.parse(storedExpenses)
        : [];

      // agregar nuevo gasto
      expenses.unshift(newExpense);

      // guardar de nuevo
      await AsyncStorage.setItem(
        'expenses',
        JSON.stringify(expenses)
      );

      alert('✅ Gasto guardado correctamente');

      // limpiar formulario
      setTitle('');
      setAmount('');
      setCategory('');
      setImage(null);
      setLocation('');

      // volver al home
      router.back();
    } catch (error) {
      console.log(error);

      alert('❌ Error guardando gasto');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ← VOLVER */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Volver
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Nuevo gasto 💸
      </Text>

      <Text style={styles.label}>
        Nombre del gasto
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: Almuerzo"
        placeholderTextColor="#64748B"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Valor
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: 25000"
        placeholderTextColor="#64748B"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>
        Categoría
      </Text>

      <View style={styles.selectorContainer}>
        {[
          'Comida',
          'Transporte',
          'Gustos',
          'Inesperados',
          'Otros',
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item &&
                styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item &&
                  styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📷 Cámara */}
      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
      >
        <Text style={styles.buttonText}>
          📷 Tomar foto
        </Text>
      </TouchableOpacity>

      {/* 🖼️ Galería */}
      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          🖼️ Elegir de galería
        </Text>
      </TouchableOpacity>

      {/* Imagen */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.preview}
        />
      )}

      {/* 📍 GPS */}
      <TouchableOpacity
        style={styles.button}
        onPress={getLocation}
      >
        <Text style={styles.buttonText}>
          📍 Obtener ubicación
        </Text>
      </TouchableOpacity>

      {location ? (
        <Text style={styles.locationText}>
          📍 {location}
        </Text>
      ) : null}

      {/* 💾 Guardar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveExpense}
      >
        <Text style={styles.saveButtonText}>
          Guardar gasto
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 50,
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    color: '#60A5FA',
    fontSize: 18,
    fontWeight: '600',
  },

  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },

  input: {
    backgroundColor: '#111827',
    color: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  button: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  preview: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },

  locationText: {
    color: '#22C55E',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#2563EB',
    padding: 20,
    borderRadius: 18,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1E293B',
  },

  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },

  categoryText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  categoryTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
});