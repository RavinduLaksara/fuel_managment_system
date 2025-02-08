import 'package:fuel_employee_new/core/models/user.dart';
import 'package:fuel_employee_new/core/services/api_service.dart';
import 'package:dio/dio.dart';

class UserRepository {
  final ApiService _apiService = ApiService();
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://fuelsystem-b.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  ));
  Future<User?> getUser(String token) async {
    try {
      final response = await _apiService.get('/users/authenticate');
      return User.fromMap(response);
    } catch (e) {
      return null;
    }
  }

  Future<User?> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      final response = await _dio.post(
        '/api/employees/login',
        data: {
          'username': email,
          'password': password,
        },
      );
      // print the status code
      print(response);
      await Future.delayed(Duration(seconds: 2));
      Map<String, dynamic> res = {
        'id': "1",
        'name': 'John Doe',
        'email': 'jogn@pumper.test',
        'photoUrl': '',
      };

      print('Signing in with email and password');
      return User.fromMap(res);


      return null;
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }
}
