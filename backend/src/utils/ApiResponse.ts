export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public errors?: any;

  constructor(statusCode: number, message = 'Success', data: T | null = null) {
    // If status code is less than 400, it's a success
    this.success = statusCode < 400; 
    this.message = message;
    this.data = data;
  }
}