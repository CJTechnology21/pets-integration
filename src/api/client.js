import UserRepository from '../repositories/UserRepository';
import PetService from '../services/petService';
import GraphQLService from '../services/graphqlService';

/**
 * Centralized API Client
 * Provides a single entry point for all API operations
 */
class ApiClient {
  // User operations
  static user = {
    create: userData => UserRepository.create(userData),
    login: (email, password) => UserRepository.login(email, password),
    register: (email, password, name) =>
      UserRepository.register(email, password, name),
    getProfile: () => UserRepository.getProfile(),
  };

  // Pet operations
  static pet = {
    createProfile: petData => PetService.createPetProfile(petData),
    getUserPets: userId => PetService.getUserPets(userId),
  };

  // Generic operations
  static graphql = {
    executeMutation: (mutation, variables, name) =>
      GraphQLService.executeMutation(mutation, variables, name),
    executeQuery: (query, variables, name) =>
      GraphQLService.executeQuery(query, variables, name),
    executeOperations: operations =>
      GraphQLService.executeOperations(operations),
  };
}

export default ApiClient;
