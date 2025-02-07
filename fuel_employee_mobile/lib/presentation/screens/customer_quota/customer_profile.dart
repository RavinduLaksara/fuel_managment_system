import 'package:flutter/material.dart';
import 'package:fuel_employee_new/data/models/customer_fuel_data.dart';
import 'package:fuel_employee_new/core/constants/app_colors.dart'; // Added for styling

class CustomerProfileScreen extends StatelessWidget {
  final CustomerFuelData customerData;

  const CustomerProfileScreen({
    Key? key,
    required this.customerData,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Profile'),
        backgroundColor: AppColors.primary, // Updated to use AppColors.primary
      ),
      body: ListView(
        children: [
          // Header section styled like profile page
          Container(
            padding: const EdgeInsets.symmetric(vertical: 40),
            alignment: Alignment.center,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: AppColors.primary,
                  child: Text(
                    (customerData.name ?? 'Unknown Name').isNotEmpty
                        ? (customerData.name ?? 'Unknown Name')[0]
                        : '?',
                    style: const TextStyle(fontSize: 40, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  customerData.name ?? 'Unknown Name',
                  style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          // Details section with Cards
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              leading: const Icon(Icons.directions_car, color: AppColors.primary),
              title: const Text('Vehicle Number'),
              subtitle: Text(customerData.vehicleNumber ?? 'N/A'),
            ),
          ),
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              leading: const Icon(Icons.local_gas_station, color: AppColors.primary),
              title: const Text('Fuel Type'),
              subtitle: Text(customerData.fuelType ?? 'N/A'),
            ),
          ),
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              leading: const Icon(Icons.category, color: AppColors.primary),
              title: const Text('Vehicle Type'),
              subtitle: Text(customerData.vehicleType ?? 'N/A'),
            ),
          ),
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              leading: const Icon(Icons.opacity, color: AppColors.primary),
              title: const Text('Total Quota'),
              subtitle: Text('${customerData.totalQuota ?? 0.0}L'),
            ),
          ),
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              leading: const Icon(Icons.opacity_outlined, color: AppColors.primary),
              title: const Text('Remaining Quota'),
              subtitle: Text('${customerData.remainingQuota ?? 0.0}L'),
            ),
          ),
        ],
      ),
      
    );
  }
}
