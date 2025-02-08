import 'package:get/get.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'presentation/theme/app_theme.dart';
import 'core/services/storage_service.dart';
import 'presentation/screens/login/login_screen.dart';
import 'presentation/screens/profile.dart';
import 'presentation/screens/transactions/transaction.dart';
import 'presentation/screens/customer_quota/customer_profile.dart';
import 'package:fuel_employee_new/data/models/customer_fuel_data.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize services
  final storageService = StorageService();
  await storageService.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent, // Set this to any color you want.
        statusBarIconBrightness: Brightness.dark, // Makes the status bar icons dark.
      ),
    );
    return GetMaterialApp(
      title: 'Fuel Master',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      defaultTransition: Transition.rightToLeftWithFade,
      home: LoginScreen(),
      routes: {
        '/profile': (context) => const ProfileScreen(),
        '/transactions': (context) => const FuelTransactionsScreen(),
        '/login': (context) => LoginScreen(),
        '/customer_profile': (context) {
          final args = ModalRoute.of(context)?.settings.arguments;
          if (args is CustomerFuelData) {
            return CustomerProfileScreen(customerData: args);
          }
          return const Scaffold(
            body: Center(child: Text("Customer data is required")),
          );
        },
      },
    );
  }
}
