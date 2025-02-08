class CustomerFuelData {
  final String id;
  final String name;
  final String vehicleNumber;
  final double? totalQuota;      // Make nullable
  final double? remainingQuota;  // Make nullable
  final double? usedQuota;       // Make nullable
  final DateTime lastPurchase;
  final String fuelType;
  final String vehicleType;

  CustomerFuelData({
    required this.id,
    required this.name,
    required this.vehicleNumber,
    this.totalQuota,            
    this.remainingQuota,         
    this.usedQuota,             
    required this.lastPurchase,
    required this.fuelType,
    required this.vehicleType,
  });
}