import { executeMutation, executeQuery } from './apiService';

/**
 * Generic GraphQL Service - Handles any GraphQL operation with standardized error handling
 */
class GraphQLService {
  /**
   * Execute a GraphQL mutation
   * @param {DocumentNode} mutation - The GraphQL mutation document
   * @param {Object} variables - Variables to pass to the mutation
   * @param {String} operationName - Name of the operation for logging/error handling
   */
  static async executeMutation(mutation, variables = {}, operationName = 'Mutation') {
    try {
      const response = await executeMutation(mutation, variables, operationName);
      return response;
    } catch (error) {
      console.error(`GraphQL Mutation Error (${operationName}):`, error);
      return {
        success: false,
        error: {
          message: error.message || `Failed to execute ${operationName}`,
          code: error.code || 'UNKNOWN_ERROR'
        }
      };
    }
  }

  /**
   * Execute a GraphQL query
   * @param {DocumentNode} query - The GraphQL query document
   * @param {Object} variables - Variables to pass to the query
   * @param {String} operationName - Name of the operation for logging/error handling
   */
  static async executeQuery(query, variables = {}, operationName = 'Query') {
    try {
      const response = await executeQuery(query, variables, operationName);
      return response;
    } catch (error) {
      console.error(`GraphQL Query Error (${operationName}):`, error);
      return {
        success: false,
        error: {
          message: error.message || `Failed to execute ${operationName}`,
          code: error.code || 'UNKNOWN_ERROR'
        }
      };
    }
  }

  /**
   * Execute multiple GraphQL operations in parallel
   * @param {Array} operations - Array of operation objects { type: 'query'|'mutation', operation, variables, name }
   */
  static async executeOperations(operations) {
    try {
      const promises = operations.map(op => {
        if (op.type === 'mutation') {
          return this.executeMutation(op.operation, op.variables, op.name);
        } else {
          return this.executeQuery(op.operation, op.variables, op.name);
        }
      });

      const results = await Promise.all(promises);
      
      return {
        success: true,
        data: results.reduce((acc, result, index) => {
          acc[operations[index].name] = result;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('GraphQL Operations Error:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Failed to execute operations',
          code: error.code || 'OPERATIONS_ERROR'
        }
      };
    }
  }
}

export default GraphQLService;