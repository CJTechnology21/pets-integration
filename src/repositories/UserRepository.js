import GraphQLService from '../services/graphqlService';
import { 
  CREATE_USER_MUTATION, 
  LOGIN_MUTATION, 
  REGISTER_MUTATION,
  GET_USER_PROFILE_QUERY 
} from '../graphql/authQueries';

/**
 * User Repository - Data access layer for user-related operations
 */
class UserRepository {
  /**
   * Create a new user
   */
  static async create(userData) {
    // Convert dob format from DD/MM/YYYY to DD-MM-YYYY as required by the API
    const formattedUserData = {
      ...userData,
      dob: userData.dob.replace(/\//g, '-')
    };
    
    return await GraphQLService.executeMutation(
      CREATE_USER_MUTATION, 
      formattedUserData, 
      'createUser'
    );
  }

  /**
   * Login user
   */
  static async login(email, password) {
    return await GraphQLService.executeMutation(
      LOGIN_MUTATION, 
      { email, password }, 
      'login'
    );
  }

  /**
   * Register user
   */
  static async register(email, password, name) {
    return await GraphQLService.executeMutation(
      REGISTER_MUTATION, 
      { email, password, name }, 
      'register'
    );
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    return await GraphQLService.executeQuery(
      GET_USER_PROFILE_QUERY, 
      {}, 
      'getUserProfile'
    );
  }
}

export default UserRepository;