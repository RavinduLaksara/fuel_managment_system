import 'primary_button.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';

class AppDialog {
  static void _showBaseDialog({
    required Widget content,
    bool barrierDismissible = true,
    Duration? autoCloseDuration = const Duration(seconds: 3),
  }) {
    Get.dialog(
      Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        elevation: 8,
        backgroundColor: Colors.white.withOpacity(0.95),
        child: TweenAnimationBuilder<double>(
          duration: const Duration(milliseconds: 300),
          tween: Tween(begin: 0.0, end: 1.0),
          builder: (context, value, child) => Transform.scale(
            scale: value,
            child: child,
          ),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.symmetric(
              horizontal: 24,
              vertical: 32,
            ),
            child: content,
          ),
        ),
      ),
      barrierDismissible: barrierDismissible,
      barrierColor: Colors.black54,
      transitionDuration: const Duration(milliseconds: 200),
    );

    if (autoCloseDuration != null) {
      Future.delayed(autoCloseDuration, () {
        if (Get.isDialogOpen ?? false) {
          Get.back();
        }
      });
    }
  }

  static Widget _buildDialogContent({
    required String message,
    String? title,
    required Widget? icon,
    required List<Widget> actions,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          TweenAnimationBuilder<double>(
            duration: const Duration(milliseconds: 400),
            tween: Tween(begin: 0.0, end: 1.0),
            builder: (context, value, child) => Transform.scale(
              scale: value,
              child: child,
            ),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: icon is Icon
                    ? (icon.color ?? AppColors.accentGreen).withOpacity(0.1)
                    : Colors.transparent,
              ),
              child: icon,
            ),
          ),
          const SizedBox(height: 24),
        ],
        if (title != null) ...[
          Text(
            title,
            style: AppTextStyles.headline2.copyWith(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
        ],
        Text(
          message,
          style: AppTextStyles.bodyText1.copyWith(
            fontSize: 16,
            color: Colors.black87,
            height: 1.4,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        ...actions.map((action) => Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: action,
        )).toList(),
      ],
    );
  }

  static void showError({
    required String message,
    String? title,
    VoidCallback? onConfirm,
  }) {
    _showBaseDialog(
      content: _buildDialogContent(
        message: message,
        title: title ?? 'Oooops!',
        icon: const Icon(
          Icons.error_outline_rounded,
          color: AppColors.error,
          size: 56,
        ),
        actions: [
          PrimaryButton(
            text: 'OK',
            onPressed: () {
              Get.back();
              onConfirm?.call();
            },
          ),
        ],
      ),
    );
  }

  static void showSuccess({
    required String message,
    String? title,
    VoidCallback? onConfirm,
    Duration? autoCloseDuration = const Duration(seconds: 3),
  }) {
    _showBaseDialog(
      content: _buildDialogContent(
        message: message,
        title: title ?? 'Success',
        icon: const Icon(
          Icons.check_circle_outline_rounded,
          color: AppColors.accentGreen,
          size: 56,
        ),
        actions: [
          PrimaryButton(
            text: 'OK',
            onPressed: () {
              Get.back();
              onConfirm?.call();
            },
          ),
        ],
      ),
      autoCloseDuration: autoCloseDuration,
    );
  }

  static void showConfirmation({
    required String message,
    String? title,
    required VoidCallback onConfirm,
    VoidCallback? onCancel,
    String confirmText = 'Confirm',
    String cancelText = 'Cancel',
  }) {
    _showBaseDialog(
      content: _buildDialogContent(
        message: message,
        title: title,
        icon: null,
        actions: [
          Row(
            children: [
              Expanded(
                child: PrimaryButton(
                  text: confirmText,
                  onPressed: () {
                    Get.back();
                    onConfirm();
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: PrimaryButton(
                  text: cancelText,
                  onPressed: () {
                    Get.back();
                    onCancel?.call();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
} 