import 'package:flutter/material.dart';
import 'package:fuel_employee_new/core/constants/app_colors.dart';
import 'package:fuel_employee_new/presentation/screens/home/widgets/fuel_transaction_card.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class FuelTransactionsScreen extends StatefulWidget {
  const FuelTransactionsScreen({super.key});

  @override
  State<FuelTransactionsScreen> createState() => _FuelTransactionsScreenState();
}

class _FuelTransactionsScreenState extends State<FuelTransactionsScreen> {
  Future<List<dynamic>> fetchTransactions() async {
    final prefs = await SharedPreferences.getInstance();
    final employeeId = prefs.getInt('employee_id')?.toString() ?? '0';
    final token = prefs.getString('token') ?? '';

    final response = await http.get(
      Uri.parse('https://fuelsystem-b.onrender.com/api/transactions/employee/$employeeId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load transactions');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Today's Fuel Transactions"),
        backgroundColor: AppColors.primary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            const SizedBox(height: 16),
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: fetchTransactions(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(child: Text('No transactions found.'));
                  }
                  final transactions = snapshot.data!;
                  return ListView.builder(
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      final tx = transactions[index];
                      return FuelTransactionCard(
                        transactionNumber: index + 1,
                        vehicleNumber: tx['vehicle']['registrationNumber'],
                        fuelAmount: (tx['pumpedAmount'] as num).toDouble(), // converted to double
                        timestamp: (tx['timestamp']),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
      
    );
  }
}