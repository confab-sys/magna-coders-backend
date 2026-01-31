import { register } from './authservice/register';
import { login } from './authservice/login';
import { logout } from './authservice/logout';
import { verifyToken, getUserFromToken, verifyUser } from './authservice/verify';

class AuthService {
  // Register new user
  async register(userData: {
    username: string;
    email: string;
    password: string;
    otp?: string;
  }): Promise<any> {
    return await register(userData);
  }

  // Login user
  async login(credentials: { identifier: string; password: string; otp?: string }): Promise<any> {
    return await login(credentials);
  }

  // Logout user
  async logout(userId: string): Promise<any> {
    return await logout(userId);
  }

  // Verify token
  verifyToken(token: string): any {
    return verifyToken(token);
  }

  // Get user from token
  async getUserFromToken(token: string): Promise<any> {
    return await getUserFromToken(token);
  }

  // Verify user account
  async verifyUser(userId: string, badge?: string): Promise<any> {
    return await verifyUser({ userId, badge });
  }

  // Update user profile
  async updateUser(userId: string, data: any): Promise<any> {
    const { updateUser } = await import('./authservice/update');
    return await updateUser(userId, data);
  }
}

export default AuthService;

// hizi zote maybe u can just add some things but maintain the same structure
// kama unajua jwt na hashing ya password nadhani utaweza kuimplement
// kwa urahisi zaidi ya hizi files zote