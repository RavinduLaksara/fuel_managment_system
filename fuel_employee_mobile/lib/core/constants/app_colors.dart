import 'package:flutter/material.dart';

class AppColors {
  // Primary colors
  static const Color primary = Colors.blue; // Dark Gray (Navbar)
  static const Color primaryDark = Color(0xFF1B1B1B);
  static const Color primaryLight = Color(0xFF424242);

  // Secondary colors
  static const Color secondary = Color(0xFF3F51B5); // Blue
  static const Color secondaryDark = Color(0xFF303F9F);
  static const Color secondaryLight = Color(0xFFC5CAE9);

  // Neutral colors
  static const Color background = Color(0xFFF5F5F5); // Light Gray (Dashboard BG)
  static const Color surface = Color(0xFFFFFFFF); // White (Cards)
  static const Color error = Color(0xFFE53935); // Red (Logout Button)

  // Text colors (various shades of blue)
  static const Color textPrimary = Color(0xFF0D47A1); // Dark Blue
  static const Color textSecondary = Color(0xFF1976D2); // Medium Blue
  static const Color textHint = Color(0xFF64B5F6); // Light Blue

  // Accent colors
  static const Color accentBlue = Color(0xFF2196F3); // Blue (Chart)
  static const Color accentGreen = Color(0xFF4CAF50); // Green (Live Status)
  static const Color accentYellow = Color(0xFFFFC107); // Yellow (Warnings)
}
