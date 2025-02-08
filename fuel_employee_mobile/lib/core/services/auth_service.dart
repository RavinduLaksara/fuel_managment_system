import '../models/user.dart';
import 'package:fuel_employee_new/core/repositories/user_repository.dart';

class AuthService {
  // Singleton instance
  static final AuthService _instance = AuthService._internal();
  final UserRepository _userRepository = UserRepository();

  // Factory constructor
  factory AuthService() {
    return _instance;
  }

  // Private constructor
  AuthService._internal();

  // Current user
  User? _currentUser;

  // Getter for current user
  User? get currentUser => _currentUser;

  // Check if user is authenticated
  bool get isAuthenticated => _currentUser != null;

  // Sign in with email and password
  Future<bool> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    User? user =
        await _userRepository.signInWithEmailAndPassword(email, password);
    return user != null;
  }
}
