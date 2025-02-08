import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:fuel_employee_new/data/models/customer_fuel_data.dart';
import 'package:fuel_employee_new/presentation/screens/customer_quota/customer_quota_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  late MobileScannerController controller;
  final RxBool isTorchOn = false.obs;
  final Rx<CameraFacing> cameraFacing = CameraFacing.back.obs;

  @override
  void initState() {
    super.initState();
    controller = MobileScannerController(
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void toggleTorch() {
    isTorchOn.value = !isTorchOn.value;
    controller.toggleTorch();
  }

  void switchCamera() {
    cameraFacing.value = cameraFacing.value == CameraFacing.back
        ? CameraFacing.front
        : CameraFacing.back;
    controller.switchCamera();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        actions: [
          IconButton(
            icon: Obx(() => Icon(
              isTorchOn.value ? Icons.flash_on : Icons.flash_off,
            )),
            onPressed: toggleTorch,
          ),
          IconButton(
            icon: Obx(() => Icon(
              cameraFacing.value == CameraFacing.front
                  ? Icons.camera_front
                  : Icons.camera_rear,
            )),
            onPressed: switchCamera,
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: controller,
            onDetect: (capture) async{
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                if (barcode.rawValue != null) {
                  debugPrint('Barcode found! ${barcode.rawValue}');
                  
                  // Get token from SharedPreferences
                  final prefs = await SharedPreferences.getInstance();
                  final token = prefs.getString('token') ?? '';

                  final response = await http.post(
                    Uri.parse('https://fuelsystem-b.onrender.com/api/employees/scan-qr'),
                    headers: <String, String>{
                      'Content-Type': 'application/json; charset=UTF-8',
                      'Authorization': 'Bearer $token',
                    },
                    body: jsonEncode(<String, String>{
                      'qrCode': barcode.rawValue!,
                    }),
                  );
                  print(response.body);
                  if (response.statusCode == 200) {
                    final data = jsonDecode(response.body);
                    final customerData = CustomerFuelData(
                      id: (data['id'] ?? '').toString(),
                      name: data['ownerName'] ?? '',
                      vehicleNumber: data['registrationNumber'] ?? '',
                      remainingQuota: (data['weekQuota'] is num ? (data['weekQuota'] as num).toDouble() : 0.0),
                      totalQuota: 300,
                      lastPurchase: DateTime.now(),
                      fuelType: data['fuelType'] ?? '',
                      vehicleType: data['model'] ?? '',
                    );
                    Get.off(() => CustomerQuotaScreen(customerData: customerData));
                    break;
                  }
                }
              }
            },
          ),
          CustomPaint(
            size: Size.infinite,
            painter: ScannerOverlayPainter(),
          ),
        ],
      ),
    );
  }
}

class ScannerOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black54
      ..style = PaintingStyle.fill;

    final scanAreaSize = size.width * 0.7;
    final scanAreaLeft = (size.width - scanAreaSize) / 2;
    final scanAreaTop = (size.height - scanAreaSize) / 2;

    // Draw semi-transparent overlay
    Path path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRect(Rect.fromLTWH(
        scanAreaLeft,
        scanAreaTop,
        scanAreaSize,
        scanAreaSize,
      ));

    canvas.drawPath(path, paint);

    // Draw scan area border
    final borderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    canvas.drawRect(
      Rect.fromLTWH(
        scanAreaLeft,
        scanAreaTop,
        scanAreaSize,
        scanAreaSize,
      ),
      borderPaint,
    );

    // Draw corner markers
    final markerLength = scanAreaSize * 0.1;
    final markerPaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0;

    // Top left corner
    canvas.drawLine(
      Offset(scanAreaLeft, scanAreaTop),
      Offset(scanAreaLeft + markerLength, scanAreaTop),
      markerPaint,
    );
    canvas.drawLine(
      Offset(scanAreaLeft, scanAreaTop),
      Offset(scanAreaLeft, scanAreaTop + markerLength),
      markerPaint,
    );

    // Top right corner
    canvas.drawLine(
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop),
      Offset(scanAreaLeft + scanAreaSize - markerLength, scanAreaTop),
      markerPaint,
    );
    canvas.drawLine(
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop),
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop + markerLength),
      markerPaint,
    );

    // Bottom left corner
    canvas.drawLine(
      Offset(scanAreaLeft, scanAreaTop + scanAreaSize),
      Offset(scanAreaLeft + markerLength, scanAreaTop + scanAreaSize),
      markerPaint,
    );
    canvas.drawLine(
      Offset(scanAreaLeft, scanAreaTop + scanAreaSize),
      Offset(scanAreaLeft, scanAreaTop + scanAreaSize - markerLength),
      markerPaint,
    );

    // Bottom right corner
    canvas.drawLine(
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop + scanAreaSize),
      Offset(scanAreaLeft + scanAreaSize - markerLength, scanAreaTop + scanAreaSize),
      markerPaint,
    );
    canvas.drawLine(
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop + scanAreaSize),
      Offset(scanAreaLeft + scanAreaSize, scanAreaTop + scanAreaSize - markerLength),
      markerPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}