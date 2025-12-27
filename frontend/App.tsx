import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-primary-600">
        DescuentApp
      </Text>
      <Text className="text-gray-600 mt-2">
        Clean Architecture + DDD + React Native
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
