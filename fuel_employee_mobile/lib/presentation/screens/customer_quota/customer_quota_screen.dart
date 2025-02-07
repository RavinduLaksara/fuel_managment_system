import 'package:fuel_employee_new/data/models/customer_fuel_data.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:pie_chart/pie_chart.dart';
import '../shared/primary_button.dart';  // Add this import

class CustomerQuotaScreen extends StatelessWidget {
  final CustomerFuelData customerData;
  final TextEditingController _fuelAmountController = TextEditingController();

  CustomerQuotaScreen({
    super.key,
    required this.customerData,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Fuel Quota'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            _buildQuotaCard(context),
            const SizedBox(height: 24),
            _buildFuelEntrySection(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.local_gas_station),
            label: 'Fuel',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: 0, // Fuel is default
        onTap: (index) {
          if (index == 1) {
            Navigator.pushNamed(
              context,
              '/customer_profile',
              arguments: customerData,
            );
          }
          // Fuel tab is the current screen; no action needed.
        },
      ),
    );
  }



  Widget _buildQuotaCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Fuel Quota Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildQuotaProgressBar(context),
            const SizedBox(height: 24),
            _buildQuotaDetails(),
          ],
        ),
      ),
    );
  }

  Widget _buildQuotaProgressBar(BuildContext context) {
    final total = customerData.totalQuota ?? 0.0;
    final remaining = customerData.remainingQuota ?? 0.0;
    final used = total - remaining;
    final dataMap = <String, double>{
      'Used': used,
      'Remaining': remaining,
    };

    return PieChart(
      dataMap: dataMap,
      animationDuration: const Duration(milliseconds: 800),
      chartRadius: MediaQuery.of(context).size.width / 3.2,
      chartValuesOptions: const ChartValuesOptions(
        showChartValues: false,
        showChartValuesInPercentage: false, // Disable percentage text
      ),
      colorList: [Colors.red, Colors.green],
    );
  }

  Widget _buildQuotaDetails() {
    return Row(
      children: [
        _buildQuotaItem(
          'Total Quota',
          customerData.totalQuota ?? 0.0,
          Colors.blue,
        ),
        _buildQuotaItem(
          'Used',
          (customerData.totalQuota ?? 0.0) - (customerData.remainingQuota ?? 0.0),
          Colors.orange,
        ),
        _buildQuotaItem(
          'Remaining',
          customerData.remainingQuota ?? 0.0,
          Colors.green,
        ),
      ],
    );
  }

  Widget _buildQuotaItem(String label, double amount, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${amount.toStringAsFixed(1)}L',
            style: TextStyle(
              color: color,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFuelEntrySection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'New Pumped Amount',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _fuelAmountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                suffixText: 'L',
              ),
            ),
            const SizedBox(height: 16),
            PrimaryButton(
              text: 'Confirm Fuel Entry',
              onPressed: () async {
                double enteredAmount = double.tryParse(_fuelAmountController.text) ?? 0.0;


                final response = await http.put(
                  Uri.parse('https://fuelsystem-b.onrender.com/api/employees/${customerData.id}/update-quota'),
                  headers: <String, String>{
                    'Content-Type': 'application/json; charset=UTF-8',
                  },
                  body: jsonEncode(<String, double>{
                    'pumpedAmount': enteredAmount,
                  }),
                );

                if (response.statusCode == 200) {
                  // Successfully updated the quota
                  final prefs = await SharedPreferences.getInstance();
                  int employeeId = prefs.getInt('employee_id') ?? 0;
                  int fuelStationId = prefs.getInt('fuel_station_id') ?? 0;
                  String fuelType = customerData.fuelType;
                  DateTime now = DateTime.now();

                  final transactionResponse = await http.post(
                    Uri.parse('https://fuelsystem-b.onrender.com/api/transactions/add'),
                    headers: <String, String>{
                      'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: jsonEncode({
                      'pumpedAmount': enteredAmount,
                      'employee': {
                        'id': employeeId,
                      },
                      'fuelStation': {
                        'id': fuelStationId,
                      },
                      'vehicle': {
                        'id': customerData.id,
                      },
                      'timestamp': now.toIso8601String(),
                      'fuelType': fuelType,
                    }),
                  );

                  if (transactionResponse.statusCode == 200) {
                    Get.back(result: true);
                  } else {
                    debugPrint('Failed to add transaction');
                  }
                } else {
                  // Handle error
                  debugPrint('Failed to update quota');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Expanded(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: color,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute}';
  }
}