import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class Loader extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;

  const Loader({
    super.key,
    this.size = 40,
    this.color,
    this.strokeWidth = 4,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        height: size,
        width: size,
        child: CircularProgressIndicator(
          strokeWidth: strokeWidth,
          valueColor: AlwaysStoppedAnimation<Color>(
            color ?? AppColors.primary,
          ),
        ),
      ),
    );
  }
} 