import { useEffect, useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';

type Expense = {
  id: string;
  title: string;
  amount: string;
  category: string;
  image?: string | null;
  location?: string;
};

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<
    Expense[]
  >([]);

  const [total, setTotal] = useState(0);

  // cargar gastos
  const loadExpenses = async () => {
    try {
      const storedExpenses =
        await AsyncStorage.getItem(
          'expenses'
        );

      const parsedExpenses =
        storedExpenses
          ? JSON.parse(storedExpenses)
          : [];

      setExpenses(parsedExpenses);

      const totalAmount =
        parsedExpenses.reduce(
          (
            sum: number,
            item: Expense
          ) =>
            sum + Number(item.amount),
          0
        );

      setTotal(totalAmount);
    } catch (error) {
      console.log(error);
    }
  };

  // eliminar gasto
  const deleteExpense = async (
    id: string
  ) => {
    try {
      const updatedExpenses =
        expenses.filter(
          (expense) =>
            expense.id !== id
        );

      setExpenses(updatedExpenses);

      await AsyncStorage.setItem(
        'expenses',
        JSON.stringify(updatedExpenses)
      );

      const totalAmount =
        updatedExpenses.reduce(
          (
            sum: number,
            item: Expense
          ) =>
            sum + Number(item.amount),
          0
        );

      setTotal(totalAmount);
    } catch (error) {
      console.log(error);
    }
  };

  // cargar al abrir
  useEffect(() => {
    loadExpenses();
  }, []);

  // recargar al volver
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Hola Daniel 👋
      </Text>

      <Animated.View
        entering={FadeInDown.duration(800)}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceTitle}>
          Total gastado este mes
        </Text>

        <Text style={styles.balanceAmount}>
          $
          {total.toLocaleString(
            'es-CO'
          )}
        </Text>

        {/* 🔥 contador */}
        <Text style={styles.expenseCounter}>
          {expenses.length} gasto
          {expenses.length !== 1
            ? 's'
            : ''}{' '}
          registrado
          {expenses.length !== 1
            ? 's'
            : ''}
        </Text>
      </Animated.View>

      <Text style={styles.sectionTitle}>
        Últimos gastos
      </Text>

      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>
          No tienes gastos aún 💸
        </Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) =>
            item.id
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          renderItem={({
            item,
            index,
          }) => (
            <Animated.View
              entering={FadeInRight.delay(
                index * 150
              )}
              style={
                styles.expenseCard
              }
            >
              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.expenseTitle
                  }
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.expenseCategory
                  }
                >
                  {item.category}
                </Text>

                {item.location ? (
                  <Text
                    style={
                      styles.locationText
                    }
                  >
                    📍{' '}
                    {
                      item.location
                    }
                  </Text>
                ) : null}

                {item.image ? (
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    style={
                      styles.expenseImage
                    }
                  />
                ) : null}
              </View>

              <View
                style={
                  styles.rightSection
                }
              >
                <Text
                  style={
                    styles.expenseAmount
                  }
                >
                  $
                  {Number(
                    item.amount
                  ).toLocaleString(
                    'es-CO'
                  )}
                </Text>

                <TouchableOpacity
                  style={
                    styles.deleteButton
                  }
                  onPress={() =>
                    deleteExpense(
                      item.id
                    )
                  }
                >
                  <Text
                    style={
                      styles.deleteText
                    }
                  >
                    🗑️
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(
            '/add-expense' as any
          )
        }
      >
        <Text style={styles.fabText}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 25,
    marginBottom: 30,
  },

  balanceTitle: {
    color: '#94A3B8',
    fontSize: 16,
  },

  balanceAmount: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 10,
  },

  expenseCounter: {
    color: '#94A3B8',
    marginTop: 8,
    fontSize: 14,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },

  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },

  expenseCard: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-start',
  },

  expenseTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  expenseCategory: {
    color: '#94A3B8',
    marginTop: 5,
  },

  locationText: {
    color: '#60A5FA',
    marginTop: 8,
    fontSize: 13,
  },

  expenseImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    marginTop: 12,
  },

  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  expenseAmount: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: 'bold',
  },

  deleteButton: {
    marginTop: 20,
  },

  deleteText: {
    fontSize: 22,
  },

  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  fabText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
});