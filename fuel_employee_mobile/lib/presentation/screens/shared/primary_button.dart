import 'package:flutter/material.dart';
import '../../../core/constants/app_text_styles.dart';

class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final double? width;

  const PrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: 50,
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          minWidth: 120, // Minimum width for the button
        ),
        child: ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue, // Blue color
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(
              vertical: 16,
              horizontal: 24, // Added horizontal padding
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8), // Updated border radius
            ),
            elevation: 0, // No shadow
          ),
          child: isLoading
              ? const SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          )
              : Text(
            text,
            style: AppTextStyles.button.copyWith(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold, // Updated font weight
            ),
          ),
        ),
      ),
    );
  }
}