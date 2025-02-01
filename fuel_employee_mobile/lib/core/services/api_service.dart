import 'package:dio/dio.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();

  static const String _baseUrl = 'http://fuelsystem-b.onrender.com';
  static const String token = 'abcd1234';

  late final Dio _dio;

  ApiService._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer $token'
        },
      ),
    );
  }

  factory ApiService() {
    return _instance;
  }

  // Generic GET request
  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await _dio.get(endpoint);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  // Generic POST request
  Future<Map<String, dynamic>> post(
      String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await _dio.post(endpoint, data: body);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  // Generic PUT request
  Future<Map<String, dynamic>> put(
      String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await _dio.put(endpoint, data: body);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  // Generic DELETE request
  Future<bool> delete(String endpoint) async {
    try {
      final response = await _dio.delete(endpoint);
      return response.statusCode == 200 || response.statusCode == 204;
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }
}
