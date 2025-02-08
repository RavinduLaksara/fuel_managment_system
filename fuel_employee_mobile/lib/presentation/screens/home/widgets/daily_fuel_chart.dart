import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

class DailyFuelChart extends StatelessWidget {
  final List<MapEntry<DateTime, double>> dailyTotals;

  const DailyFuelChart({super.key, required this.dailyTotals});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 300, // Increased from 250 to provide more vertical space
      child: Padding(
        padding: const EdgeInsets.only(top: 20), // Add padding at the bottom
        child: BarChart(
          BarChartData(
            alignment: BarChartAlignment.spaceAround,
            maxY: dailyTotals.isEmpty ? 100 : (dailyTotals.map((e) => e.value).reduce((a, b) => a > b ? a : b) * 1.2),
            barTouchData: BarTouchData(enabled: true),
            titlesData: FlTitlesData(
              leftTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 40,
                  getTitlesWidget: (value, meta) {
                    // Only show values divisible by 100 to avoid overlap
                    if (value % 100 == 0) {
                      return Text(
                        value.toInt().toString(),
                        style: const TextStyle(fontSize: 12),
                      );
                    }
                    return const Text('');
                  },
                ),
              ),
              rightTitles: AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              topTitles: AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 60, // Increased from 40
                  getTitlesWidget: (value, meta) {
                    if (value.toInt() >= 0 && value.toInt() < dailyTotals.length) {
                      return Transform.rotate(
                        angle: -45 * 3.14159 / 180, // Convert degrees to radians
                        child: Text(
                          DateFormat('MM/dd').format(dailyTotals[value.toInt()].key),
                          style: const TextStyle(fontSize: 10),
                        ),
                      );
                    }
                    return const Text('');
                  },
                ),
              ),
            ),
            gridData: FlGridData(
              show: true,
              drawVerticalLine: true,
              drawHorizontalLine: true,
              horizontalInterval: 100,
              getDrawingHorizontalLine: (value) {
                return FlLine(
                  color: Colors.grey.withOpacity(0.2),
                  strokeWidth: 1,
                );
              },
              getDrawingVerticalLine: (value) {
                return FlLine(
                  color: Colors.grey.withOpacity(0.2),
                  strokeWidth: 1,
                );
              },
            ),
            borderData: FlBorderData(show: false),
            barGroups: List.generate(
              dailyTotals.length,
              (index) => BarChartGroupData(
                x: index,
                barRods: [
                  BarChartRodData(
                    toY: dailyTotals[index].value,
                    color: Colors.green, // Changed from Colors.blue to Colors.green
                    width: 16,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}