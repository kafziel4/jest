import { ReqResClient } from '../clients/reqres-client';
import {
  headers,
  jsonContentType,
  missingPassword,
} from '../fixtures/constants';
import { ErrorResponse } from '../types/common';
import { LoginRequest, LoginResponse } from '../types/login';

let reqResClient: ReqResClient;

describe('ReqRes API Login endpoints', () => {
  beforeAll(() => {
    reqResClient = new ReqResClient();
  });

  test('POST to /login with valid data should return status 200 and the login token', async () => {
    // Arrange
    const requestBody: LoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    const expectedResponse: LoginResponse = {
      token: 'QpwL5tke4Pnpja7X4',
    };

    // Act
    const response = await reqResClient.postLogin(requestBody);

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers[headers.contentType]).toBe(jsonContentType);
    expect(response.data).toEqual(expectedResponse);
  });

  test('POST to /login with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: LoginRequest = {
      email: 'peter@klaven',
    };

    const expectedResponse: ErrorResponse = {
      error: missingPassword,
    };

    // Act
    const response = await reqResClient.postLogin(requestBody);

    // Assert
    expect(response.status).toBe(400);
    expect(response.headers[headers.contentType]).toBe(jsonContentType);
    expect(response.data).toEqual(expectedResponse);
  });
});
