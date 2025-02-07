import 'package:flutter/material.dart';

class FuelTransactionCard extends StatelessWidget {
  final int transactionNumber;
  final String vehicleNumber;
  final double fuelAmount;
  final String timestamp;

  const FuelTransactionCard({
    super.key,
    required this.transactionNumber,
    required this.vehicleNumber,
    required this.fuelAmount,
    required this.timestamp,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        // leading: const CircleAvatar(
        //   backgroundColor: Colors.blue,
        //   child: Icon(Icons.local_gas_station, color: Colors.white),
        // ),
        title: Text('Transaction ID: $transactionNumber'),
        subtitle: Text(' Registration Number: $vehicleNumber'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '$fuelAmount L',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              '${timestamp}',
            ),
          ],
        ),
      ),
    );
  }
} 