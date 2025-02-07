import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:fuel_employee_new/core/constants/app_colors.dart';
import 'package:fuel_employee_new/presentation/screens/shared/primary_button.dart';
import 'package:fuel_employee_new/presentation/screens/qr_scanner/qr_scanner_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fuel_employee_new/presentation/screens/home/widgets/daily_fuel_chart.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<MapEntry<DateTime, double>> _dailyTotals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final employeeId = prefs.getInt('employee_id') ?? 0;
      final token = prefs.getString('token');
      
      if (employeeId == 0 || token == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Session expired. Please login again.'))
          );
          _handleLogout(context);
        }
        return;
      }
      
      final response = await http.get(
        Uri.parse('https://fuelsystem-b.onrender.com/api/transactions/employee/${employeeId}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> transactions = json.decode(response.body);
        
        // Process transactions by date
        final Map<DateTime, double> dailyData = {};
        
        for (var transaction in transactions) {
          final date = DateTime.parse(transaction['timestamp']).copyWith(
            hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0
          );
          dailyData[date] = (dailyData[date] ?? 0) + (transaction['pumpedAmount'] ?? 0).toDouble();
        }

        // Sort by date
        var sortedEntries = dailyData.entries.toList()
          ..sort((a, b) => a.key.compareTo(b.key));
        
        // Take last 10 days
        if (sortedEntries.length > 10) {
          sortedEntries = sortedEntries.sublist(sortedEntries.length - 10);
        }

        setState(() {
          _dailyTotals = sortedEntries;
          _isLoading = false;
        });
      } else if (response.statusCode == 401) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Session expired. Please login again.'))
          );
          _handleLogout(context);
        }
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to load transaction data'))
        );
      }
    }
  }

  Future<void> _openQRScanner(BuildContext context) async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (context) => const QRScannerScreen(),
      ),
    );

    if (result != null && context.mounted) {
      // Handle the scanned QR code result
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Scanned QR Code: $result'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _handleLogout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); // Clear all stored data
    
    if (context.mounted) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/login', // Make sure you have this route defined in your app
        (route) => false, // This removes all previous routes
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _fetchTransactions,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  const Text(
                    "Home",
                    style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 28, 28, 29),
                    ),
                  ),
                  const SizedBox(height: 10),
                  
                  // const Text(
                  //   "Last 10 days Pumped Fuel",
                  //   style: TextStyle(
                  //     fontSize: 20,
                      
                  //     fontWeight: FontWeight.bold,
                  //     color: Color.fromARGB(255, 28, 28, 29),
                  //   ),
                  // ),
                  // Add the chart
                  if (_isLoading)
                    const Center(child: CircularProgressIndicator())
                  else if (_dailyTotals.isEmpty)
                    const Center(child: Text('No transaction data available'))
                  else
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 16), // Added margin
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: const Color.fromARGB(255, 35, 30, 30).withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Daily Fuel Distribution',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          DailyFuelChart(dailyTotals: _dailyTotals),
                        ],
                      ),
                    ),

                  const SizedBox(height: 50),
                  PrimaryButton(
                    onPressed: () => _openQRScanner(context),
                    text: "Scan QR",
                  ),
                  const SizedBox(height: 16),
                  // Added Logout button
                  PrimaryButton(
                    onPressed: () => _handleLogout(context),
                    text: "Logout",
                  ),
                  const SizedBox(height: 16),
                  
                  // Today's Fuel List Title
                  

                  // Today's Fuel List
                  
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
        currentIndex: 0, // Home is the default screen
        onTap: (index) {
          switch (index) {
            case 0:
              // Already on HomeScreen; no action needed.
              break;
            case 1:
              Navigator.pushNamed(context, '/transactions');
              break;
            case 2:
              Navigator.pushNamed(context, '/profile');
              break;
          }
        },
      ),
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () => _openQRScanner(context),
      //   backgroundColor: AppColors.primary,
      //   child: const Icon(Icons.qr_code_scanner),
      // ),
    );
  }
}
